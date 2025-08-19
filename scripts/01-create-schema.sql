-- Quai Web3 Analytics Dashboard Database Schema
-- This script creates all necessary tables for the analytics dashboard

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
    amount DECIMAL(78, 0) NOT NULL, -- Raw amount (before decimal adjustment)
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
