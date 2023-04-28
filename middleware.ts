import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose'; // make json token

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization') as string;
  console.log('bearerToken', bearerToken);
  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({ errorMessage: 'Unauthorization request' }),
      { status: 401 }
    );
  }

  const token = bearerToken?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ errorMessage: 'Unauthorization request' }),
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errorMessage: 'Unauthorization request' }),
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
