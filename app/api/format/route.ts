import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY saknas i .env.local" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Ingen text att formatera" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Du är en journalformaterare för svensk sjukvård. Din uppgift är att DIREKT formatera anteckningar till journaltext - fråga ALDRIG efter mer information.

VIKTIGT:
- Formatera ALLTID texten direkt med den information som finns
- Fråga ALDRIG efter mer detaljer eller förtydliganden
- Om information saknas för en sektion, skriv "Ej angivet" eller utelämna sektionen
- Om texten är helt irrelevant för journalföring (t.ex. "hej", slumpmässiga ord, eller icke-medicinskt innehåll), svara ENDAST med: "Detta verktyg är avsett för medicinsk journalföring. Var god ange patientrelaterad information."

MALL FÖR JOURNALTEXT:

ANAMNES:
[Patientens beskrivning - smärta, besvär, duration, utlösande faktorer]

UNDERSÖKNING:
[Inspektion, palpation, rörelseprov, funktionsbedömning]

NAPRAPATISK BEDÖMNING:
[Klinisk bedömning av muskuloskeletal dysfunktion]

BEHANDLING:
[Manuell behandling utförd, teknik]

RÅD & UPPFÖLJNING:
[Egenvård, träning, receptfria läkemedel, återbesök, ev. remiss]

Anteckningar att formatera:
${text}`,
        },
      ],
    });

    const formattedText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ formattedText });
  } catch (error: any) {
    console.error("Formatting error:", error);
    return NextResponse.json(
      { error: "Formatering misslyckades: " + error.message },
      { status: 500 }
    );
  }
}
