import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, sessionId, path, duration } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Capture basic request data
    let ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    if (typeof ip !== "string") ip = "";
    const cleanIp = (ip.split(",")[0] ?? "").trim();
    
    // Geolocation from IP (using a public free API, fail gracefully)
    let country = "Unknown";
    let city = "Unknown";
    
    if (cleanIp && cleanIp !== "::1" && cleanIp !== "127.0.0.1") {
      try {
        const geoReq = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,city`);
        const geoData = await geoReq.json();
        if (geoData.status === "success") {
          country = geoData.country;
          city = geoData.city;
        }
      } catch (e) {
        // Silently ignore geo lookup failure
      }
    }

    if (type === "pageview") {
      const { referrer, device, browser, os, isOrganic } = body;
      
      // Keep track of the page view
      await prisma.pageView.create({
        data: {
          sessionId,
          path,
          referrer,
          country,
          city,
          device,
          browser,
          os,
          isOrganic,
        },
      });

      // Update or create visitor session
      const session = await prisma.visitorSession.findUnique({
        where: { fingerprint: sessionId },
      });

      if (!session) {
        await prisma.visitorSession.create({
          data: {
            fingerprint: sessionId,
            country,
            city,
            device,
            browser,
            os,
            referrer,
            isOrganic,
            pagesViewed: 1,
            firstSeen: new Date(),
            lastSeen: new Date(),
            bounced: true // Assume bounce until they visit a second page
          },
        });
      } else {
        await prisma.visitorSession.update({
          where: { fingerprint: sessionId },
          data: {
            pagesViewed: { increment: 1 },
            lastSeen: new Date(),
            bounced: false, // Discard bounce when viewed >1 page
          },
        });
      }
      
      return NextResponse.json({ success: true });
      
    } else if (type === "session_end") {
      // Update session duration
      if (duration && duration > 0) {
        await prisma.pageView.updateMany({
           where: { sessionId, path },
           data: { duration }
        });
        
        await prisma.visitorSession.update({
          where: { fingerprint: sessionId },
          data: { duration: { increment: duration }, lastSeen: new Date() },
        });
      }
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
