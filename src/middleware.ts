import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas que requerem autenticação
const protectedRoutes = [
  '/',
  '/dashboard',
  '/comercial',
  '/operacional',
  '/relatorios',
  '/conexoes',
  '/admin',
  '/tarefas'
];

// Lista de rotas públicas (não precisam de autenticação)
const publicRoutes = [
  '/login',
  '/api/auth'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Se é uma rota pública, permitir acesso
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Se não é uma rota protegida, permitir acesso
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Verificar se existe token de autenticação
  const token = request.cookies.get('auth-token')?.value;
  
  // Se não há token e é uma rota protegida, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
