import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...")

    // Read and execute schema creation
    const schemaScript = `
-- Tokens table to store ERC-20 token information
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) NOT NULL UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    decimals INTEGER NOT NULL DEFAULT 18,
    price_usd DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ERC-20 transfers table
CREATE TABLE IF NOT EXISTS erc20_transfers (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount DECIMAL(78, 0) NOT NULL,
    amount_usd DECIMAL(20, 8) DEFAULT 0,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (token_address) REFERENCES tokens(address)
);

-- DEX swaps table
CREATE TABLE IF NOT EXISTS dex_swaps (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    dex_name VARCHAR(50) NOT NULL,
    trader_address VARCHAR(42) NOT NULL,
    token_in_address VARCHAR(42) NOT NULL,
    token_out_address VARCHAR(42) NOT NULL,
    amount_in DECIMAL(78, 0) NOT NULL,
    amount_out DECIMAL(78, 0) NOT NULL,
    amount_usd DECIMAL(20, 8) DEFAULT 0,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (token_in_address) REFERENCES tokens(address),
    FOREIGN KEY (token_out_address) REFERENCES tokens(address)
);

-- Whale watch list
CREATE TABLE IF NOT EXISTS whale_watch (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    label VARCHAR(100),
    threshold_usd DECIMAL(20, 8) DEFAULT 10000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DAO treasuries table
CREATE TABLE IF NOT EXISTS dao_treasuries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    description TEXT,
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_erc20_transfers_timestamp ON erc20_transfers(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_erc20_transfers_amount_usd ON erc20_transfers(amount_usd DESC);
CREATE INDEX IF NOT EXISTS idx_erc20_transfers_token ON erc20_transfers(token_address);
CREATE INDEX IF NOT EXISTS idx_dex_swaps_timestamp ON dex_swaps(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dex_swaps_amount_usd ON dex_swaps(amount_usd DESC);
CREATE INDEX IF NOT EXISTS idx_dex_swaps_trader ON dex_swaps(trader_address);
    `

    await sql(schemaScript)
    console.log("✅ Schema created successfully")

    // Seed data
    const seedScript = `
-- Insert sample tokens
INSERT INTO tokens (address, symbol, name, decimals, price_usd) VALUES
('0x1234567890123456789012345678901234567890', 'QUAI', 'Quai Network Token', 18, 0.25),
('0x2345678901234567890123456789012345678901', 'WETH', 'Wrapped Ether', 18, 2500.00),
('0x3456789012345678901234567890123456789012', 'USDC', 'USD Coin', 6, 1.00)
ON CONFLICT (address) DO UPDATE SET
    price_usd = EXCLUDED.price_usd,
    updated_at = CURRENT_TIMESTAMP;

-- Insert some whale addresses to watch
INSERT INTO whale_watch (wallet_address, label, threshold_usd) VALUES
('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 'Vitalik Buterin', 50000),
('0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', 'Binance Hot Wallet', 100000),
('0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a', 'Bitfinex Cold Storage', 75000)
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert sample DAO treasuries
INSERT INTO dao_treasuries (name, wallet_address, description, website) VALUES
('Quai Foundation', '0x1111111111111111111111111111111111111111', 'Official Quai Network Foundation Treasury', 'https://quai.network'),
('DeFi Protocol DAO', '0x2222222222222222222222222222222222222222', 'Community-governed DeFi protocol on Quai', 'https://example-defi.com'),
('Gaming DAO', '0x3333333333333333333333333333333333333333', 'Gaming-focused DAO building on Quai Network', 'https://example-gaming.com')
ON CONFLICT (wallet_address) DO NOTHING;
    `

    await sql(seedScript)
    console.log("✅ Seed data inserted successfully")

    console.log("🎉 Database setup complete!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

runMigrations()
