import { useState, useEffect } from "react"
import Web3 from 'web3/dist/web3.min.js';
import StakerContract from '../StakerApp.json'
import { contactAddress } from '../contractAddress';


const DashBoard = ({selectedAccount, stakeyContract}) => {

    const [buyAmount, setBuyAmount] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [unStakeAmount, setUnStakeAmount] = useState('');
    const [trfAdd, setTrfAdd] = useState('');
    const [trfAmount, setTrfAmount] = useState('');
    const [amountStaked, setAmountStaked] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    let stakeContract = stakeyContract;

    useEffect(()=> {
        console.log(stakeyContract)

        tokenStaked().then((p) => setAmountStaked(p))
        tokensBalance().then((p) => setTokenBalance(p/ (10**18)))
    }, [])

    const tokensBalance = async () => {
    
        let p = await stakeContract.methods.getTokenBalance().call({ from : selectedAccount})
        return p
    }

    const tokenStaked = async () => {
        let p = await stakeContract.methods.getAmountStaked().call({ from : selectedAccount})
        return p
    }
    

    const buyToken = (amount) => {
    
        let provider = window.ethereum;
        stakeContract.methods.buyToken().send({ from : selectedAccount, value: new Web3(provider).utils.toWei(amount, "ether")})
        .then((tx) => {
            console.log(tx)
            alert('Successful')
            tokensBalance().then((p) => setTokenBalance(p/ (10**18)))
            setBuyAmount('')
        }).catch((err) => {
            alert("Transaction has been cancelled or rejected.")
            setBuyAmount('')
        })
    }

    const stake = (numOfTokens) => {
        console.log(stakeContract);
        stakeContract.methods.stakeToken(numOfTokens).send({ from : selectedAccount}).then((tx) => {
            console.log(tx)
            alert('Successful')
            tokensBalance().then((p) => setTokenBalance(p/ (10**18)))
            tokenStaked().then((p) => setAmountStaked(p))
            setStakeAmount('')
        }).catch((err) => {
            alert("Transaction has been cancelled or rejected.")
            setStakeAmount('')
        })
    }

    const unStake = (numOfTokens) => {
    
        stakeContract.methods.unstakeToken(numOfTokens).send({ from : selectedAccount}).then((tx) => {
            console.log(tx)
            alert('Successful')
            tokensBalance().then((p) => setTokenBalance(p/ (10**18)))
            tokenStaked().then((p) => setAmountStaked(p))
            setUnStakeAmount('')
        }).catch((err) => {
            alert("Transaction has been cancelled or rejected.")
            setUnStakeAmount('')
        })
    }

    const transFer = (address, amount) => {
        console.log(stakeContract);
        stakeContract.methods.transferTokens(address, amount).send({ from : selectedAccount}).then((tx) => {
            console.log(tx)
            alert(`Successful transfer of ${amount} tokens to ${address}`)
            tokensBalance().then((p) => setTokenBalance(p/ (10**18)))
            setTrfAdd('')
            setTrfAmount('')
        }).catch((err) => {
            alert("Transaction has been cancelled or rejected.")
            setTrfAdd('')
            setTrfAmount('')
        })
    }


    return (
        <>
        <div className= "address-bar">
            <p>
                Welcome
            </p>
            <h3>
                {selectedAccount}
            </h3>
        </div>
        <div className= "balances">
            <div className= "balances-staked">
                <p>
                    Amount Staked
                </p>
                <h2>
                    {amountStaked}
                </h2>
            </div>

            <div className= "balances-token">
                <p>
                    Token Balance
                </p>
                <h2>
                    {tokenBalance}
                </h2>

            </div>

        </div>

        <div className= "tools-options">

            <div className= "tools-stake">
                <label>
                    Buy Tokens
                </label>
                <div className= "tools-stake-entry">
                    <input type= "number" placeholder= "Enter amount of ETH you want to spend" value= {buyAmount} onChange={(e)=> setBuyAmount(e.target.value)}/>
                    <button onClick= {() => buyToken(buyAmount)}>
                        Buy Tokens
                    </button>
                </div>

            </div>

            <div className= "tools-stake">
                <label>
                    Stake Tokens
                </label>
                <div className= "tools-stake-entry">
                    <input placeholder= "Enter amount to stake" value= {stakeAmount} onChange={(e)=> setStakeAmount(e.target.value)} />
                    <button onClick= {() => stake(stakeAmount)}>
                        Stake
                    </button>
                </div>

            </div>

            <div className= "tools-stake">
                <label>
                    Unstake Tokens
                </label>
                <div className= "tools-stake-entry">
                    <input placeholder= "Enter amount to stake" value= {unStakeAmount} onChange={(e)=> setUnStakeAmount(e.target.value)} />
                    <button onClick= {unStake}>
                        Unstake
                    </button>
                </div>

            </div>

            <div className= "tools-transfer-token">
                <label>
                    Transfer Tokens
                </label>
                
                <input placeholder= "Enter address to transfer to" value= {trfAdd} onChange={(e)=> setTrfAdd(e.target.value)} />
                <input placeholder= "Enter amount to transfer" value= {trfAmount} onChange={(e)=> setTrfAmount(e.target.value)} />
                <button onClick= {() => transFer(trfAdd, trfAmount)}>
                    Transfer
                </button>
                

            </div>
        </div>
        </>
    )
}


export default DashBoard