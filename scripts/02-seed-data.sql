-- Seed data for Quai Web3 Analytics Dashboard
-- This script populates the database with sample tokens and initial data

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
