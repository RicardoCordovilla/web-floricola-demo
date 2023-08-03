import React, { useState } from 'react'
import { BiHome } from 'react-icons/bi';
import { TbPhotoSensor3 } from 'react-icons/tb';
import { BsLayoutTextSidebar, BsDeviceSsd } from 'react-icons/bs';
import { useNavigate } from 'react-router';




const SideNavBar = () => {

    const navigate = useNavigate()

    const [hover, setHover] = useState(false)

    const handleNavigate = (e) => {
        navigate(e)
        window.location.reload()

    }

    return (
        <div className='sidenavbar'
            onMouseMove={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {!hover && <BsLayoutTextSidebar
                className='sidenavbar_headericon'
                fontSize={'2rem'}
            />}

            {
                hover &&

                <div className="sidenavbar_devicesContainer">
                    <div className="sidenavbar_devicesContainer_header">
                        <BsLayoutTextSidebar
                            className='sidenavbar_headericon'
                            fontSize={'2rem'}
                        />

                        <span className="sidenavbar_devicesContainer_hederText">
                            Equipos
                        </span>


                    </div>

                    <div
                        className="sidenavbar_devicesContainer_deviceBox"
                        onClick={() => handleNavigate('/ESP1')}
                    >

                        <TbPhotoSensor3 />
                        <span>EQUIPO 1</span>
                    </div>

                    <div
                        className="sidenavbar_devicesContainer_deviceBox"
                        onClick={() => handleNavigate('/ESP2')}
                    >

                        <TbPhotoSensor3 />
                        <span>EQUIPO 2</span>
                    </div>

                    <div
                        className="sidenavbar_devicesContainer_deviceBox"
                        onClick={() => handleNavigate('/ESP3')}
                    >

                        <TbPhotoSensor3 />
                        <span>EQUIPO 3</span>
                    </div>
                </div>
            }

        </div>
    )
}

export default SideNavBar