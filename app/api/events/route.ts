import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleGetEvents(userId: string) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);

    const endMonth = currentMonth + 3;
    const endDate = new Date(currentYear, endMonth, 1);

    const events = await prisma.event.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        name: true,
        time: true,
        isRecurring: true,
      },
    });

    const returnedEvents = events.map((event) => ({
      id: event.id,
      date: event.date,
      title: event.name,
      time: event.time,
      isRecurring: event.isRecurring,
    }));

    return NextResponse.json(
      { success: true, events: returnedEvents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events." },
      { status: 500 }
    );
  }
}

async function handleAddEvent(
  event: {
    date: Date;
    title: string;
    time: string;
    recurring: boolean;
  },
  userId: string
) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        date: event.date,
        name: event.title,
        time: event.time,
        isRecurring: event.recurring,
        userId: userId,
      },
    });
    if (newEvent) {
      if (event.recurring) {
        await prisma.event.createMany({
          data: Array.from({ length: 11 }, (_, i) => ({
            date: new Date(
              newEvent.date.getFullYear(),
              newEvent.date.getMonth() + i + 1,
              newEvent.date.getDate()
            ),
            name: newEvent.name,
            time: newEvent.time,
            isRecurring: true,
            userId: userId,
          })),
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "Event added successfully.",
          event: newEvent,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to add event." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add event." },
      { status: 500 }
    );
  }
}

async function handleUpdateEvent(
  event: {
    id: string;
    date?: Date;
    title?: string;
    time?: string;
    recurring?: boolean;
  },
  userId: string
) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        date: event.date,
        name: event.title,
        time: event.time,
        isRecurring: event.recurring,
        userId: userId,
      },
    });

    if (updatedEvent) {
      return NextResponse.json(
        {
          success: true,
          message: "Event updated successfully.",
          event: updatedEvent,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to update event." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event." },
      { status: 500 }
    );
  }
}

async function handleDeleteEvent(eventId: string, userId: string) {
  try {
    await prisma.event.deleteMany({
      where: { id: eventId, userId: userId },
    });
    return NextResponse.json(
      { success: true, message: "Event deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "getEvents":
        return await handleGetEvents(userId);
      case "addEvent":
        const { event } = body;
        return await handleAddEvent(event, userId);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "updateEvent":
        const { event } = body;
        return await handleUpdateEvent(event, userId);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication token is missing." },
        { status: 401 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "deleteEvent":
        const { eventId } = body;
        return await handleDeleteEvent(eventId, userId);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
