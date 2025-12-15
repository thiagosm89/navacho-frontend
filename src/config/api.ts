/**
 * Configuração da API
 * Lê a URL base da API de variáveis de ambiente
 * Fallback para http://localhost:3000 se não estiver definida
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://barbearia-backend-ochre.vercel.app';

