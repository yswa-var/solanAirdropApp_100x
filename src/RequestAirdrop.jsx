import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState, useEffect } from 'react';

function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);

    // Check if button should be disabled
    const isButtonDisabled = loading || !wallet.publicKey || !amount || parseFloat(amount) <= 0;

    // Fetch balance when wallet changes
    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet.publicKey) {
                try {
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalance(balance / LAMPORTS_PER_SOL);
                } catch (err) {
                    console.error('Error fetching balance:', err);
                    setBalance(0);
                }
            } else {
                setBalance(0);
            }
        };

        fetchBalance();
    }, [wallet.publicKey, connection]);

    async function requestAirdrop() {
        if (!wallet.publicKey) {
            setError('Please connect your wallet first');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const signature = await connection.requestAirdrop(wallet.publicKey, parseFloat(amount) * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature);
            setSuccess(`Successfully airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
            setAmount(''); // Clear the input
            
            // Refresh balance after successful airdrop
            const newBalance = await connection.getBalance(wallet.publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
        } catch (err) {
            console.error('Airdrop error:', err);
            
            // Handle specific error cases
            if (err.message && err.message.includes('429')) {
                setError('Airdrop limit reached. You\'ve either reached your daily limit or the faucet is temporarily unavailable. Please visit https://faucet.solana.com for alternate sources of test SOL.');
            } else if (err.message && err.message.includes('insufficient')) {
                setError('Insufficient funds in the faucet. Please try again later or visit https://faucet.solana.com');
            } else {
                setError(`Airdrop failed: ${err.message || 'Unknown error occurred'}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3 className="airdrop-title">Request Airdrop</h3>
            
            <div className="airdrop-form">
                <input 
                    type="number" 
                    id="amount" 
                    placeholder="Amount in SOL" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="airdrop-input"
                />
                <button 
                    onClick={requestAirdrop} 
                    disabled={isButtonDisabled}
                    className="airdrop-button"
                >
                    {loading && <span className="loading-spinner"></span>}
                    {loading ? 'Requesting...' : 'Request Airdrop'}
                </button>
            </div>
            
            {error && (
                <div className="message error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            {success && (
                <div className="message success">
                    <strong>Success:</strong> {success}
                </div>
            )}
            
            <div className="balance-display">
                <div className="balance-amount">{balance.toFixed(4)} SOL</div>
                <div className="balance-label">Current Balance</div>
            </div>
        </div>
    );
}

export default RequestAirdrop;