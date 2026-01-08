-- Adicionar suporte para Sign in with Apple
-- Executar este script no seu banco de dados PostgreSQL

-- 1. Adicionar coluna apple_id (nullable e unique)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255);

-- 2. Criar índice único para apple_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_apple_id 
ON users(apple_id);

-- 3. Permitir que hashed_password seja NULL (para login social)
ALTER TABLE users 
ALTER COLUMN hashed_password DROP NOT NULL;

-- 4. Verificar alterações
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
