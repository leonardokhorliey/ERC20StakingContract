
import './App.css';
import DashBoard from './components/DashBoard';
import Landing from './components/Landing';
import { useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import StakerContract from './StakerApp.json'
import { contactAddress } from './contractAddress';

//const Web3 = require('web3/dist/main')

function App() {

  const [loaded, setLoaded] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [stakeContract, setStakeContract] = useState({});



  const init = async () => {
    let provider = window.ethereum;
    console.log(provider);
    setLoaded(1)
  
    if (typeof provider !== 'undefined') {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setSelectedAccount(accounts[0]);
          console.log(`Selected account is ${selectedAccount}`);
          setLoaded(2)

        })
        .catch((err) => {
          console.log(err);
          return;
        });
  
      window.ethereum.on('accountsChanged', function (accounts) {
        setLoaded(1)
        setSelectedAccount(accounts[0]);
        console.log(`Selected account changed to ${selectedAccount}`)
        setTimeout(() => setLoaded(2), 1000)
      });
    }
  
    const web3 = new Web3(provider);
  
    setStakeContract(new web3.eth.Contract(
    	StakerContract.abi,
    	contactAddress
    ));
  };

  
  const loadPage = (<div>
    <p>Loading .....</p>
  </div>)


  


  return (
    <div className="App">
      <header className="App-header">

        {loaded === 0 && <Landing launchApp = {init} /> }
        {loaded === 1 && loadPage }
        {loaded === 2 && <DashBoard selectedAccount = {selectedAccount} stakeyContract = {stakeContract}
        />
        }
        
      </header>
    </div>
  );
}

export default App;
