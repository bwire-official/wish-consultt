import React from 'react'
import Image from 'next/image';
import image from '../Assets/dp.jpeg'


const Success = () => {
  return (
    <div>
        <div className="successes">
            <div className="success">
                <h3>Success Stories</h3>
                <div className="success-flex">
                    <div className="succ-main">
                        <Image
                            aria-hidden
                            src={image}
                            alt="Globe icon"
                        
                        />
                        <h4>Brooklyn Ham</h4>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates mollitia quisquam, dolore labore maiores maxime minima beatae.</p>
                    </div>

                    <div className="succ-masked">

                        <div className="succ">
                            <div className="succ-c">
                                <Image
                                    aria-hidden
                                    src={image}
                                    alt="Globe icon"
                                
                                />
                                <div>
                                    <h4>Brooklyn Ham</h4>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates mollitia quisquam, dolore labore maiores maxime minima beatae.</p>
                                </div>
                            </div>
                        </div>

                        <div className="succ">
                            <div className="succ-c">
                                <Image
                                    aria-hidden
                                    src={image}
                                    alt="Globe icon"
                                
                                />
                                <div>
                                    <h4>Brooklyn Ham</h4>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates mollitia quisquam, dolore labore maiores maxime minima beatae.</p>
                                </div>
                            </div>
                        </div>

                        <div className="succ">
                            <div className="succ-c">
                                <Image
                                    aria-hidden
                                    src={image}
                                    alt="Globe icon"
                                
                                />
                                <div>
                                    <h4>Brooklyn Ham</h4>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates mollitia quisquam, dolore labore maiores maxime minima beatae.</p>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Success