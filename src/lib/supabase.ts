import { createClient } from '@supabase/supabase-js'

// Log para verificar as variáveis de ambiente
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '*** Configurado ***' : 'Não configurado')
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '*** Configurado ***' : 'Não configurado')

// Configuração do cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const SUPABASE_ENABLED = Boolean(supabaseUrl && supabaseAnonKey)

if (!SUPABASE_ENABLED) {
  console.warn('[Supabase] Variáveis de ambiente ausentes no ambiente local. A aplicação funcionará com fallback local (mock).')
  console.warn('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local para usar o banco real no dev.')
}

export const supabase = SUPABASE_ENABLED
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : null as any

export interface PreOrderData {
  id?: string
  nome: string
  telefone: string
  created_at?: string
}

// Função para criar a tabela pre_order se não existir
const createPreOrderTable = async (): Promise<boolean> => {
  try {
    console.log('Tentando criar a tabela pre_order...')
    
    // Tenta criar a tabela usando SQL direto
    const { error: createTableError } = await supabase.rpc('exec', {
      query: `
        -- Garante que a extensão UUID está instalada
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Cria a tabela se não existir
        CREATE TABLE IF NOT EXISTS public.pre_order (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          nome TEXT NOT NULL,
          telefone TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilita RLS (Row Level Security)
        ALTER TABLE public.pre_order ENABLE ROW LEVEL SECURITY;
        
        -- Cria política para permitir inserções anônimas
        DROP POLICY IF EXISTS "Allow public insert" ON public.pre_order;
        CREATE POLICY "Allow public insert" 
        ON public.pre_order
        FOR INSERT 
        TO anon
        WITH CHECK (true);
      `
    })
    
    if (createTableError) {
      console.error('Erro ao criar a tabela pre_order:', createTableError)
      return false
    }
    
    console.log('Tabela pre_order criada com sucesso!')
    return true
  } catch (error) {
    console.error('Erro inesperado ao tentar criar a tabela pre_order:', error)
    return false
  }
}

// Função para verificar se a tabela existe
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    if (!SUPABASE_ENABLED) {
      // Em dev sem env, considere que "existe" para não bloquear o fluxo
      return true
    }
    // Tenta fazer uma consulta simples à tabela para ver se ela existe
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    // Se não houver erro, a tabela existe
    if (!error) return true
    
    // Se houver erro, verifica se é porque a tabela não existe
    if (error.code === '42P01') { // 42P01 = undefined_table
      console.error(`Tabela ${tableName} não encontrada no banco de dados.`)
      return false
    }
    
    // Outro tipo de erro
    console.error(`Erro ao verificar a tabela ${tableName}:`, error)
    return false
  } catch (error) {
    console.error(`Erro inesperado ao verificar a tabela ${tableName}:`, error)
    return false
  }
}

export const savePreOrder = async (userData: Omit<PreOrderData, 'id' | 'created_at'>): Promise<PreOrderData | null> => {
  try {
    console.log('Tentando salvar no Supabase:', userData)
    if (!SUPABASE_ENABLED) {
      // Fallback local: simula salvamento e retorna um ID
      const mockId = (self as any)?.crypto?.randomUUID?.() || String(Date.now())
      const record: PreOrderData = { id: mockId, nome: userData.nome, telefone: userData.telefone, created_at: new Date().toISOString() }
      const existing = JSON.parse(localStorage.getItem('multicrypto_preorders') || '[]')
      existing.push(record)
      localStorage.setItem('multicrypto_preorders', JSON.stringify(existing))
      return record
    }
    
    // Verifica se a tabela existe, se não existir, tenta criar
    const tableExists = await checkTableExists('pre_order')
    if (!tableExists) {
      console.log('Tabela pre_order não encontrada. Tentando criar...')
      const created = await createPreOrderTable()
      if (!created) {
        throw new Error('Não foi possível criar a tabela pre_order')
      }
    }
    
    // Tenta inserir os dados
    const { data, error } = await supabase
      .from('pre_order')
      .insert({
        nome: userData.nome,
        telefone: userData.telefone
      })
      .select()
      .single()

    console.log('Resposta do Supabase - Data:', data)
    console.log('Resposta do Supabase - Error:', error)

    if (error) {
      // Se der erro de tabela não encontrada, tenta criar a tabela
      if (error.code === '42P01') { // 42P01 = undefined_table
        console.log('Tabela não encontrada. Tentando criar...')
        
        // Tenta criar a tabela via SQL
        const { error: createError } = await supabase.rpc('create_pre_order_table')
        
        if (createError) {
          console.error('Erro ao criar tabela via RPC:', createError)
          
          // Se não conseguir criar via RPC, tenta com SQL direto
          const { error: sqlError } = await supabase.rpc('exec', {
            query: `
              CREATE TABLE IF NOT EXISTS public.pre_order (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
              
              -- Permite acesso anônimo à tabela
              ALTER TABLE public.pre_order ENABLE ROW LEVEL SECURITY;
              
              -- Política para permitir inserções anônimas
              DROP POLICY IF EXISTS "Enable insert for all users" ON public.pre_order;
              CREATE POLICY "Enable insert for all users" 
              ON public.pre_order
              FOR INSERT 
              TO anon
              WITH CHECK (true);
            `
          })
          
          if (sqlError) {
            console.error('Erro ao criar tabela via SQL direto:', sqlError)
            throw new Error('Não foi possível criar a tabela pre_order')
          }
          
          // Tenta inserir novamente após criar a tabela
          const retryResult = await supabase
            .from('pre_order')
            .insert({
              nome: userData.nome,
              telefone: userData.telefone
            })
            .select()
            .single()
            
          if (retryResult.error) {
            console.error('Erro ao salvar após criar a tabela:', retryResult.error)
            throw retryResult.error
          }
          
          return retryResult.data
        }
        
        // Tenta inserir novamente após criar a tabela
        const retryResult = await supabase
          .from('pre_order')
          .insert({
            nome: userData.nome,
            telefone: userData.telefone
          })
          .select()
          .single()
          
        if (retryResult.error) {
          console.error('Erro ao salvar após criar a tabela:', retryResult.error)
          throw retryResult.error
        }
        
        return retryResult.data
      }
      
      // Outro tipo de erro
      console.error('Erro ao salvar pré-cadastro:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    console.log('Dados salvos com sucesso:', data)
    return data
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
}

export interface UserData {
  id?: string
  name: string
  whatsapp: string
  country_code: string
  created_at?: string
}

export const saveUserData = async (userData: Omit<UserData, 'id' | 'created_at'>): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('Error saving user data:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error saving user data:', error)
    return null
  }
}

export const getUserCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error getting user count:', error)
      return 1000 // fallback to default
    }

    return (count || 0) + 1000 // Add base count of 1000
  } catch (error) {
    console.error('Error getting user count:', error)
    return 1000
  }
}
