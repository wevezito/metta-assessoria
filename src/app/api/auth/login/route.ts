import { NextRequest, NextResponse } from 'next/server';

// Credenciais temporárias (em produção, use um banco de dados)
const VALID_CREDENTIALS = {
  email: 'admin@mettaassessoria.com',
  password: 'metta2024'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validar credenciais
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      // Criar token simples (em produção, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          email,
          name: 'Administrador',
          role: 'admin'
        }
      });
      
      // Configurar cookie de autenticação
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      });
      
      return response;
    }
    
    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
