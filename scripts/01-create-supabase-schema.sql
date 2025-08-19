-- Create tables for Quai Network analytics
CREATE TABLE IF NOT EXISTS tokens (
  id SERIAL PRIMARY KEY,
  address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  decimals INTEGER DEFAULT 18,
  total_supply BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  transaction_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42) NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  amount_formatted DECIMAL(36, 18) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_whale BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (token_address) REFERENCES tokens(address)
);

CREATE TABLE IF NOT EXISTS swaps (
  id SERIAL PRIMARY KEY,
  transaction_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  dex_name VARCHAR(50) NOT NULL,
  trader_address VARCHAR(42) NOT NULL,
  token_in VARCHAR(42) NOT NULL,
  token_out VARCHAR(42) NOT NULL,
  amount_in NUMERIC(78, 0) NOT NULL,
  amount_out NUMERIC(78, 0) NOT NULL,
  amount_in_formatted DECIMAL(36, 18) NOT NULL,
  amount_out_formatted DECIMAL(36, 18) NOT NULL,
  price_impact DECIMAL(5, 4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (token_in) REFERENCES tokens(address),
  FOREIGN KEY (token_out) REFERENCES tokens(address)
);

CREATE TABLE IF NOT EXISTS whale_watchlist (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  label VARCHAR(100),
  threshold_amount DECIMAL(36, 18) DEFAULT 10000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transfers_timestamp ON transfers(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_whale ON transfers(is_whale, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_from_address ON transfers(from_address);
CREATE INDEX IF NOT EXISTS idx_transfers_to_address ON transfers(to_address);
CREATE INDEX IF NOT EXISTS idx_swaps_timestamp ON swaps(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_swaps_trader ON swaps(trader_address);
