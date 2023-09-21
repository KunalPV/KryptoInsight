import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import bitcoin from '../assets/bitcoin.png'
import peep1 from '../assets/peep-1.png'
import peep2 from '../assets/peep-2.png'
import peep3 from '../assets/peep-3.png'
import peep4 from '../assets/peep-4.png'
import peep5 from '../assets/peep-5.png'

const Onboarding = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center relative">
        <div className='w-full flex justify-center items-center flex-col gap-64'>
            <div className='w-[60%] flex flex-col justify-start items-start gap-4 p-4'>
                <h1 className='text-5xl font-bold'>Revolutionize Your Surveys with KryptoInsight</h1>
                <p className='font-light w-[40%]'>Break free from uninspiring surveys! <br /> KryptoInsight offers crypto rewards for your valuable insights.”</p>
            </div>
            <div>
                <Link to='/'>
                    <button className='btn py-0 px-20 bg-black text-white'>
                        Get Started
                        <BsArrowRight />
                    </button>
                </Link>
            </div>
        </div>

        <div className='absolute -z-30 w-full min-h-screen'>
            {/* Bottom left img */}
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="252" viewBox="0 0 500 282" fill="none" className=' absolute left-0 bottom-0'>
                <path opacity="0.25" d="M255.214 27.4049C201.138 19.2988 191.676 135.686 137.605 127.546C104.434 122.552 102.8 70.6947 69.597 75.4706C37.9249 80.0263 44.7175 120.77 18.5819 139.092C-53.2317 189.438 -142.702 1.48075 -198.913 81.2463C-280.549 197.091 -2.05782 203.981 -49.373 293.59C-75.2005 342.504 -177.746 316.93 -168.406 371.365C-154.36 453.229 -15.3952 342.152 37.3629 403.582C72.6457 444.665 22.5375 516.056 72.5502 537.302C130.809 562.051 130.37 447.98 189.712 425.91C295.535 386.552 370.157 618.775 453.78 543.358C537.601 467.762 317.588 375.79 359.271 271.295C379.49 220.608 479.391 220.805 459.17 170.118C437.732 116.378 349.588 196.587 300.522 165.423C251.755 134.448 312.471 35.9879 255.214 27.4049Z" stroke="black" strokeWidth="52.1113" strokeDasharray="3.47 3.47"/>
            </svg>
            {/* Top left img */}
            <svg xmlns="http://www.w3.org/2000/svg" width="384" height="221" viewBox="0 0 724 371" fill="none" className='absolute top-0 right-0'>
                <path opacity="0.25" d="M496.214 -186.595C442.138 -194.701 432.676 -78.3144 378.605 -86.4542C345.434 -91.4476 343.8 -143.305 310.597 -138.529C278.925 -133.974 285.717 -93.2304 259.582 -74.9079C187.768 -24.5624 98.2977 -212.519 42.087 -132.754C-39.5488 -16.909 238.942 -10.0185 191.627 79.5898C165.799 128.504 63.2542 102.93 72.5941 157.365C86.6402 239.229 225.605 128.152 278.363 189.582C313.646 230.665 263.537 302.056 313.55 323.302C371.809 348.051 371.37 233.98 430.712 211.91C536.535 172.552 611.157 404.775 694.78 329.358C778.601 253.762 558.588 161.79 600.271 57.2955C620.49 6.60769 720.391 6.80479 700.17 -43.8824C678.732 -97.622 590.588 -17.4134 541.522 -48.577C492.755 -79.5517 553.471 -178.012 496.214 -186.595Z" stroke="black" strokeWidth="52.1113" strokeDasharray="3.47 3.47"/>
            </svg>

            {/* Top left asterisk */}
            <svg width="241" height="202" viewBox="0 0 241 302" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-0 left-0'>
                <path d="M47.3898 -42.9765L49.8866 85.7176M49.8866 85.7176L39.495 212.126M49.8866 85.7176L-108.756 77.1665M49.8866 85.7176L207.323 122.485M49.8866 85.7176L226.411 -63.6636M49.8866 85.7176L167.412 290.409M49.8866 85.7176L-60.0059 202.06M49.8866 85.7176L-84.639 -58.8113" stroke="black" strokeWidth="44.222"/>
            </svg>

            {/* Middle right star */}
            <svg width="237" height="279" viewBox="0 0 247 439" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute right-0 top-48'>
                <path d="M182.636 98.3034L164.309 3M215.473 73.0423L227.309 25.1992M215.473 312.258L240.673 435.884M182.636 350.149L174.618 401.82M291.073 161.73L364 123.565M89.4727 161.73L7 109.786M53.5818 180.976H14.6364M107.8 276.28L37.1636 335.605M299.091 257.306L355.218 285.876M193.431 161.73L252.478 109.786L234.867 190.818L306.345 211.076L234.867 231.334L252.478 285.876L199.128 257.306L147.332 327.95L153.548 243.801L53.5818 226.14L138.345 190.818L121.952 113.941L193.431 161.73Z" stroke="black" strokeWidth="22.9952"/>
            </svg>

            <img src={bitcoin} alt="bitcoin" className='absolute bottom-0 right-0 w-80 h-72 -z-40' />

            <svg width="359" height="126" className='absolute bottom-36 flex justify-center items-center w-full' viewBox="0 0 509 176" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse opacity="0.25" cx="254.452" cy="87.6222" rx="254.132" ry="87.475" fill="#9DDADB"/>
            </svg>

            <svg width="1267" height="253" className='absolute bottom-32 flex justify-center items-center w-full' viewBox="0 0 1167 403" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse opacity="0.25" cx="583.452" cy="201.622" rx="583.212" ry="200.748" fill="#9DDADB"/>
            </svg>

            <div className='absolute w-full min-h-full'>
                <div className='absolute flex justify-center items-center w-full top-64 right-64'>
                    <img src={peep1} alt="peep-1" className='w-32 h-64' />
                </div>
                <div className='absolute flex justify-center items-center w-full top-44 right-16'>
                    <img src={peep2} alt="peep-2" className='w-32 h-64' />
                </div>
                <div className='absolute flex justify-center items-center w-full top-64 left-12'>
                    <img src={peep3} alt="peep-3" className='w-32 h-64' />
                </div>
                <div className='absolute flex justify-center items-center w-full top-44 left-40'>
                    <img src={peep4} alt="peep-4" className='w-32 h-64' />
                </div>
                <div className='absolute flex justify-center items-center w-full top-60 left-72'>
                    <img src={peep5} alt="peep-5" className='w-32 h-64' />
                </div>
            </div>


        </div>
    </div>
  )
}

export default Onboarding