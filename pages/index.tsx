import { useState, useEffect, useRef, } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios"
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import localFont from '@next/font/local'

const poppins = localFont({
  src: [
    {
      path: '../public/Geometria.ttf',
      weight: '400'
    }
  ],
  variable: '--font-poppins'
})
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false)
  const videoRef = useRef(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const { select, wallets, publicKey, disconnect } = useWallet();
  const [xsHidden, setXsHidden] = useState<string>('hidden');
  const [connectStatus, setConnectStatus] = useState("Connect wallet")
  const [videoHidden, setVideoHidden] = useState<string>('hidden')
  const [spinHidden, setSpinHidden] = useState<string>('show')
  const [winStatus, setWinStatus] = useState<string>('')
  const [playStatus, setPlayStatus] = useState<boolean>(false)
  const [firstModal, setFirstModal] = useState<string>('')
  const [tabsShow, setTabsShow] = useState<string>('hidden')
  const [walletColor, setWalletColor] = useState<string>('text-white bg-black/50 backdrop-blur-[4px] border-[#D679BC] border-solid border-2')
  const [WalletPhantomButtonContext, setWalletPhantomButtonContext] = useState<string>('text-white')
  const [walletPhantomButtonBackground, setWalletPhantomButtonBackground] = useState<string>('')
  const [walletBackpackButtonContext, setWalletBackpackButtonContext] = useState<string>('text-white')
  const [walletBackpackButtonBackground, setWalletBackpackButtonBackground] = useState<string>('')
  const [backpackIcon, setBackpackIcon] = useState<string>('/Backpack.svg')
  const [walletName, setWalletName] = useState<string>('')
  const [connectButtonIcon, setConnectButtonIcon] = useState<string>('hidden w-[25px]')
  const [connectWalletIcon, setConnectWalletIcon] = useState<string>('/PhantomIcon.svg')
  const [connectWalletName, setConnectWalletName] = useState<string>('')
  const [dropIcon, setDropIcon] = useState<string>('hidden')
  const [navBarIconShow, setNavBarIconShow] = useState<string>('')
  const [navWalletIcon, setNavWalletIcon] = useState<string>('')
  const [remainTimes, setRemainTimes] = useState<number>(0)
  const [showCongratulationModal, setShowCongratulationModal] = useState<boolean>(false)
  const [showLooseModal, setShowLooseModal] = useState<boolean>(false)
  const [winValue, setWinValue] = useState<number>(1)
  
  



  const handleConnectWallet = (name) => {
    if(name === 'Phantom'){
      setWalletPhantomButtonBackground('bg-white')
      setWalletPhantomButtonContext('text-[#D679BC]')
      setWalletBackpackButtonBackground('')
      setWalletBackpackButtonContext('text-white')
      setBackpackIcon('/Backpack.svg')
      setWalletName('Phantom')
    }
    else if(name === 'Backpack'){
      setWalletBackpackButtonBackground('bg-white')
      setWalletBackpackButtonContext('text-[#D679BC]')
      setWalletPhantomButtonBackground('')
      setWalletPhantomButtonContext('text-white')
      setBackpackIcon('/backpackchange.svg')
      setWalletName('Backpack')
    }
    const wallet = wallets.filter((item) => item.adapter.name === name)
    if (wallet[0].readyState === "NotDetected" && wallet[0].adapter.name === "Backpack" )
    location.href = "https://chrome.google.com/webstore/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof"
    else if (wallet[0].readyState === "NotDetected" && wallet[0].adapter.name === "Phantom")
    location.href = "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa"
    else(
      select(wallet[0].adapter.name),
      setConnectWalletName(wallet[0].adapter.name),
      setShowModal1(false),
      localStorage.setItem("walletName", wallet[0].adapter.name)
    )
  }
  const handleOpenChallenge = async() => {
    if(!publicKey) {
      toast('Please connect wallet', { hideProgressBar: false, autoClose: 2000, type: 'error' })
    }
    else if(publicKey) {
      const response = await axios.post('https://climb-server.onrender.com/api/spots/remainTimes', {
        data: {
          walletAddress: publicKey.toBase58()
        },
      })
      setShowModal(true)
      setXsHidden('hidden')
      setShowChallengeModal(true)
      setRemainTimes(4-response.data.remainTimes)
      setNavBarIconShow('')
      setWinStatus('')
    }
    
  }
  const endSpotRotate = () => {
    setPlayStatus(false)
    setVideoHidden("hidden")
    setSpinHidden("")
    if (winValue === 1){
      setShowCongratulationModal(true)
      setShowChallengeModal(false)
    }
    else if (winValue === 3){
      setShowLooseModal(true)
      setShowChallengeModal(false)
    }
  }



  const videoHandler = async() => {
    if(playStatus === false){
      if(!publicKey) {
        toast('Please connect wallet', { hideProgressBar: false, autoClose: 2000, type: 'error' })
      }
      else if (publicKey){
        const response = await axios.post('https://climb-server.onrender.com/api/spots', {
          data: {
            walletAddress: publicKey.toBase58()
          },
        })
        if (response.data==="There are no more chances today"){
          setVideoHidden("hidden")
          setSpinHidden("")
          setRemainTimes(0)
          toast(response.data, { hideProgressBar: false, autoClose: 2000, type: 'error' })
        }
        else {
          setRemainTimes(response.data.remainTimes-1)
          setVideoHidden("")
          setSpinHidden("hidden")
          setWinValue(response.data.winStatus)
          setWinStatus('/spot/'+response.data.winStatus+'.webm')
          await videoRef.current.play();
        }
      }
  }
  };
  useEffect(() => {
    setConnectWalletName(localStorage.getItem('walletName'))
    if(!publicKey) {
      setConnectStatus('Connect wallet')
      setConnectButtonIcon('hidden')
      setDropIcon('hidden')
      setWalletColor('text-white bg-black/50 backdrop-blur-[4px] border-[#D679BC] border-solid border-2')
    }
    else if (publicKey){
      const connectPublic = publicKey.toBase58().substring(0,4) + ".." + publicKey.toBase58().substring(39,43)
      setConnectStatus(connectPublic)
      // handleConnectWallet()
      setWalletColor('bg-white text-black')
      if(connectWalletName === "Phantom"|| connectWalletName === '"Phantom"') {
        setConnectButtonIcon('w-[25px]')
        setDropIcon('')
        setConnectWalletIcon("/PhantomIcon.svg")
        setNavWalletIcon('/phantomNav.svg')
      }
      else if(connectWalletName === 'Backpack'|| connectWalletName === '"Backpack"'){
        setConnectButtonIcon('w-[17px]')
        setConnectWalletIcon("/backpackchange.svg")
        setNavWalletIcon('/Backpack.svg')
        setDropIcon('')
      } 
    }
  }, [publicKey]);


  
  return (
    <div className={`absolute h-screen w-screen ${poppins.variable} font-sans`}>
      <iframe className="z-0 h-screen w-screen absolute" src="1.html"></iframe>
      {/* <div className="absolute h-25 py-3 z-1  bg-black/50 rounded-lg  backdrop-blur-[2px] inline-flex top-10 left-20 ">
        <img src ='/avatar.png' className='pl-6 my-4'/>
        <div className="inline-grid grid-rows-2 gap-4 my-4">
          <button className="rounded-lg bg-yellow-200 ml-5 mr-5 px-3 text-red-500 hover:bg-yellow-300 font-bold  shadow-amber-700 shadow-lg inline-flex">
            <img src ='/mologo.png' className='pl-1 my-auto'/>
            <div className='px-1 my-auto'>3234 $MR</div>
          </button>
          <button className="rounded-lg text-yellow-200 ml-5 mr-5 px-3 bg-red-500 hover:bg-red-300 font-bold  shadow-red-700 shadow-lg inline-flex">
            <img src ='/wallet.png' className='pl-1 my-auto'/>
            <div className='px-1 m-auto'>Wallet</div>
          </button>
        </div>
      </div> */}
      <div className={`flex fixed items-center justify-center w-screen h-screen bg-black/50 backdrop-blur-[4px] ${firstModal} z-10 `}>
        <div className="absolute w-[600px] h-[350px]  rounded-tr-[25px] rounded-bl-[25px] shadow-[8px_8px_0px_0px_#D9D9D9] bg-white z-1">
          <button className="absolute top-[40px] right-[40px] z-50" onClick={() => {setFirstModal('hidden'), setTabsShow('flex')}}>
            <img src="/close.svg"></img>
          </button>
          <div className="flex fixed w-[600px] h-[350px] items-center justify-center">
            <div className="flow-root">
              <div className="flex justify-center items-center">
                <img className="w-[140px] h-[60px] mb-[22px]" src='/mLogo.svg'></img>
              </div>
              <div className={`text-center mb-[26px] ${poppins.variable} font-sans font-semibold text-[16px]`}>Experience an exciting journey by immersing yourself <br /> in a unique interactive adventure within the city of Marius.</div> 
              <div className={`text-center mb-[26px] ${poppins.variable} font-sans font-semibold text-[16px]`}>You can count on Marius to take good care of you and create <br /> a truly enjoyable adventure.</div>
              <div className="flex justify-center items-center">
                <button className={`bg-[#D679BC] w-[250.68px] h-[45.04px] rounded-[7px] shadow-[4px_4px_0px_0px_#A6498C] ${poppins.variable} text-[24px] font-sans font-semibold text-white`} onClick={() => {setFirstModal('hidden'), setTabsShow('flex')}}>Marius World</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`absolute hidden md:${tabsShow} w-[745px] h-[50px] z-1 top-[68px] right-16`}>
        <div className="flex items-center h-25 z-1 w-[380px] h-[50px] bg-black/50 rounded-[12px]  backdrop-blur-[4px] ">
          <div className={`ml-[35px] text-white text-[16px] ${poppins.variable} font-sans`}>
            <button
              onClick={() => handleOpenChallenge()}
            > 
              Challenges 
            </button>
          </div>
          <div className='flex w-[66px] h-[22.5px] ml-[40px] items-center text-white'>
            <div className="inline-flex mt-[2px]  left-0">
              <img className="w-[11px] h-[14.3px]" src='/key.svg'/>
            </div>
            <button className={`text-[16px] ml-[5px] ${poppins.variable} font-sans`}>
              Studio
            </button>
          </div>
          <div className='flex w-[83px] h-[22.5px] ml-[45px] items-center text-white'>
            <div className=" inline-flex mt-[2px] left-0">
              <img className="w-[11px] h-[14.3px]" src='/key.svg'/>
            </div>
            <button className={`text-[16px] ml-[5px] ${poppins.variable} font-sans`}>
              Cinema
            </button>
          </div>
        </div>
        <div className="h-25 z-1 bg-black/50 rounded-[12px] p-2 px-3 backdrop-blur-[4px] inline-flex ml-5">
            <img src='/twitter.svg' className="h-6 w-6 m-auto"/>
        </div>
        <div className="h-25 z-1 bg-black/50 rounded-[12px]  backdrop-blur-[4px] inline-flex ml-5">      
          <img src='/discord.svg' className="h-12 w-12"/>
        </div>
        <button
          className={`inline-flex w-[190px] justify-center items-center rounded-[12px] font-bold py-3 ${walletColor} ml-[25px]`}
          type="button"
          onClick={() => {
            if (connectStatus === "Connect wallet") setShowModal1(true)
            else if (connectStatus !== "Connect wallet") disconnect()
          }}
        >
          <img className={`ml-4 mr-[3px] ${connectButtonIcon}`} src={connectWalletIcon}></img>
          <div className={`w-[200px] whitespace-nowrap ${poppins.variable} font-sans`}>
            {connectStatus}
          </div>
          <img className={`my-auto w-[30px] mr-[10px] ${dropIcon}`} src='/drop.svg'></img>
        </button>
        
      </div>
      {/* response */}
      <button data-collapse-toggle="navbar-sticky" type="button" className={`absolute top-12 ${navBarIconShow} right-8 inline-flex items-center p-2 z-3 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`} aria-controls="navbar-sticky" aria-expanded="false" onClick={() => {
          if (xsHidden === 'hidden') {setXsHidden(''), setNavBarIconShow('hidden')}
          else {setXsHidden('hidden'), setNavBarIconShow('')}
      }}>
          <span className="sr-only">Open main menu</span>
          <img className="w-[23px]" src='/navBarIcon.svg'></img>
      </button>
      <div className={`w-screen h-screen z-1 md:flex md:w-screen  ${xsHidden}`} id="navbar-sticky">
        <ul className="flex flex-col p-4 md:p-0 font-semibold md:flex-row md:hidden md:space-x-14 h-screen border-black rounded-lg w-full m-auto bg-[#382A3A]/80 backdrop-blur-[2px] md:mt-0">
          <button data-collapse-toggle="navbar-sticky" type="button" className="absolute top-12 right-8 inline-flex items-center p-2 z-2 text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false" onClick={() => {
              {setXsHidden('hidden'), setNavBarIconShow('')}
            }}>
              <span className="sr-only">Open main menu</span>
              <img className="w-[23px]" src='/navBarClose.svg'></img>
          </button>
          <li className="md:hidden mt-[147px] mx-[15px]" >
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'>
              <button onClick={() => {
                if (connectStatus === "Connect wallet") setShowModal1(true)
                else if (connectStatus !== "Connect wallet") disconnect()
              }}>
                  {connectStatus}
              </button>
              <img className={`absolute right-0 w-6 ${connectButtonIcon}`} src={navWalletIcon}></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'> 
              <button onClick={() => {
                handleOpenChallenge()
                }}>
                  Challenges
              </button> 
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'> 
              <button onClick={() => {
                  setShowModal(true),setXsHidden('hidden'),setNavBarIconShow('')
                }}>
                  Studio
              </button> 
              <img className={`absolute right-0 w-4`} src='/key.svg'></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'> 
              <button onClick={() => {
                  setShowModal(true),setXsHidden('hidden'),setNavBarIconShow('')
                }}>
                  Cinema
              </button> 
              <img className={`absolute right-0 w-4`} src='/key.svg'></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'> 
              <button onClick={() => {
                  setShowModal(true),setXsHidden('hidden'),setNavBarIconShow('')
                }}>
                  Discord
              </button>
              <img className={`absolute right-0 w-6 ml-2`} src='/navDiscord.svg'></img>
              {/* <img src ='/Discord.png' className=' absolute object-scale-down px-3  right-4'/> */}
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className='inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-2  border-solid border-gray-500'> 
              <button onClick={() => {
                  setShowModal(true),setXsHidden('hidden'),setNavBarIconShow('')
                }}>
                  Twitter 
              </button>
              <img className={`absolute right-0 w-6 ml-2`} src='/navTwitter.svg'></img>
            </div>
          </li>
        </ul>
      </div>
      <ToastContainer />
      {/* challenge */}
      {showChallengeModal ? (
        <>
          <div
            className="w-screen h-screen bg-black/80 backdrop-blur-[9px]  fixed inset-0 z-3 outline-none focus:outline-none pb-20"
          >
            <button 
              className="mt-[63px] ml-[198px] bg-[#D679BC] absolute  h-12 rounded-[12px]"
              onClick={() => {
                setShowChallengeModal(false),setXsHidden('hidden'), setNavBarIconShow('')
              }}
              >
              <div className="m-auto px-10 inline-flex text-white">
                <div className="my-auto h-1/2 inline-flex mr-2">
                  <img src="/line.svg"/>
                </div>
                Back
              </div>
            </button>
            <div className="w-screen h-screen  flex justify-center m-auto">
              <div className="inline-flex my-auto  h-full">
              <div className={`m-auto w-[600px] ${spinHidden}`}>
                <img src='/2.png'/>
              </div>
              <div className={`w-[590px] m-auto ${videoHidden}`}>
                <video ref={videoRef} autoPlay src={winStatus} onPlay={() => setPlayStatus(true)} onEnded={() => endSpotRotate()}>
                </video>
              </div>
                <div className="flex flex-col items-center justify-center w-[330px] h-[400px] my-auto rounded-[20px] bg-black/10 backdrop-blur-[5px]">
                    <div className="text-white text-center font-sans font-bold text-[20px] mb-[40px]">{remainTimes} spins left</div>
                    <button className="flex items-center justify-center bg-white h-[50px] w-[200px] rounded-[6px] mb-[12px] font-bold font-sans text-[25px]" onClick={() => {videoHandler()}}>Spin</button>
                    <button className="flex items-center justify-center bg-black text-white border border-white h-[50px] w-[200px] rounded-[6px] mb-[12px] font-bold font-sans text-[25px]">Buy a turn</button>
                    <button className="flex items-center border-solid w-[200px] mb-[20px] h-12 bg-[#929292]/40 backdrop-blur-[4px] rounded-full text-[#BABABA] text-xl">
                      <img src='/lockModal.svg' className="ml-[12px]"></img>
                      <img src='/film.svg' className="ml-[20px] mt-[3px]"></img>
                      <div className="text-[25px] font-bold ml-[3px]">
                        Dice
                      </div>
                    </button>
                </div>
              </div>
            </div>
            
          </div>
        </>
      ) : null}
      {showModal1 ? (
        <>
          <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50 rounded-[12px]  backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-[480px] h-[340px] bg-black/30 rounded-[12px]  backdrop-blur-[4px]">
              <button className="absolute top-[40px] right-[35px] w-[15px] z-[2]" onClick={() => setShowModal1(false)}>
                <img src='/close1.svg'></img>
              </button>
              <div className="flow-root">
                <div className="text-[26px] text-center font-bold text-white mb-14">Select your wallet</div>
                <button className={`flex items-center border-2 w-[300px] ${walletPhantomButtonBackground} h-[60px] rounded-[12px] mb-4`} onClick={() => handleConnectWallet('Phantom')}>
                  <img className="w-[36px] ml-8" src='/PhantomIcon.svg'></img>
                  <div className={`ml-4 ${WalletPhantomButtonContext} font-bold text-[22px]`}>Phantom</div>
                </button>
                <button className={`flex items-center ${walletBackpackButtonBackground} border-2 w-[300px] h-[60px] rounded-[12px] mb-6`} onClick={() => handleConnectWallet('Backpack')}>
                  <img className={`w-[24px] ml-[38px]`} src={backpackIcon}></img>
                  <div className={`ml-[23px] font-bold text-[22px] ${walletBackpackButtonContext}`}>Backpack</div>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showCongratulationModal ? (
        <>
          <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-[580px] h-[300px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
              <button className="absolute top-[40px] right-[35px] w-[15px] z-[2]" onClick={() => {setShowCongratulationModal(false), handleOpenChallenge()}}>
                <img src='/close1.svg'></img>
              </button>
              <div className="flow-root items-center">
                <div className="text-[40px] text-center font-bold text-white mb-[14px]">Congratulations!</div>
                <div className="flex justify-center items-center w-[580px] mb-[14px]">
                  <div className="w-[220px] border-b-2"></div>
                </div>
                <div className="text-[26px] text-center text-white">a Spot OGs has been <br /> awarded to you</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showLooseModal ? (
        <>
          <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-[580px] h-[300px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
              <button className="absolute top-[40px] right-[35px] w-[15px] z-[2]" onClick={() => {setShowLooseModal(false), handleOpenChallenge()}}>
                <img src='/close1.svg'></img>
              </button>
              <div className="flow-root items-center">
                <div className="text-[30px] text-center font-bold text-white mb-[14px]">Damn, 2 days without a whitelist</div>
                <div className="flex justify-center items-center w-[580px] mb-[14px]">
                  <div className="w-[220px] border-b-2"></div>
                </div>
                <div className="text-[26px] text-center text-white">That's a long time</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
        
    </div>
  );
}
