import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function shouldRetrieveMemories(message: string): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI assistant that determines if additional context or memories are needed to answer a user\'s question. Respond with "Yes" if memories are needed, or "No" if the question can be answered without additional context. Respond with only a single word: Yes or No.' },
        { role: 'user', content: `Answer with only a single word. Do I need to retrieve memories to answer this question: "${message}"?` },
      ],
    });

    const decision = completion.choices[0].message.content?.trim().toLowerCase();
    return decision === 'yes';
  } catch (error) {
    console.error('Error in memory retrieval decision:', error);
    return false; // Default to not retrieving memories if there's an error
  }
}

async function shouldSaveToMemory(message: string): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI assistant that determines if a message contains important information that should be saved for future reference. Respond with ONLY "Yes" or "No". Be more inclined to say "Yes" if there\'s any doubt.' },
        { role: 'user', content: `Should this message be saved to memory? Answer ONLY "Yes" or "No": "${message}"` },
      ],
    });

    const decision = completion.choices[0].message.content?.trim().toLowerCase();
    // console.log('Raw save to memory decision:', decision);
    
    // More lenient decision logic
    const shouldSave = decision?.includes('yes') || decision === 'y' || decision === 'true' || decision === '1';
    // console.log('Interpreted save to memory decision:', shouldSave);
    
    return shouldSave;
  } catch (error) {
    console.error('Error in memory save decision:', error);
    return true; // Default to saving if there's an error, to be safe
  }
}

async function saveToMemory(messages: any, compadreId: string) {
  try {
    const response = await fetch('https://api.mem0.ai/v1/memories/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.MEM0_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        user_id: compadreId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Memory saved successfully:', result);
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

export async function POST(req: NextRequest) {
  const { user, message, compadreName, compadreId, characteristics } = await req.json()

  let memString = '';
  const needMemories = await shouldRetrieveMemories(message);

  if (needMemories) {
    const mem0Response = await fetch('https://api.mem0.ai/v1/memories/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.MEM0_API_KEY}`,
      },
      body: JSON.stringify({
        query: 'Is there anything related to these words: ' + message,
        user_id: compadreId,
      }),
    });

    if (!mem0Response.ok) {
      console.log(await mem0Response.text());
      return new Response('Error fetching memories', { status: 500 });
    }

    const memories = (await mem0Response.json()) as { memory: string }[];
    memString = memories.map((memory) => memory.memory).join('\n\n');
  }

  const systemPrompt = `You're name is ${compadreName}, and you're a helpful AI friend with the following characteristics: ${characteristics}. Your task is to engage in a conversation, keeping these traits in mind. ${memString ? `Here's some relevant information/context about the user and or what they may be talking about: ${memString}` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });
    
    const messages_for_memory = [
      { "role": "user", "content": message },
      { "role": "assistant", "content": completion.choices[0].message.content },
    ];

    const reply = completion.choices[0].message.content;

    // Check if the message should be saved to memory
    const shouldSave = await shouldSaveToMemory(message); // will be true or false
    console.log('Should save decision:', shouldSave);
    if (shouldSave) {
        await saveToMemory(messages_for_memory, compadreId);
    } // there's a problem where it thinks we should never save to memory 

    return NextResponse.json({ message: reply }, { status: 200 });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}