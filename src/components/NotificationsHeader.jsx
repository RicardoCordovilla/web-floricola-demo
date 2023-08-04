import React, { useState } from 'react'

const NotificationsHeader = () => {

    const [hideInfo, setHideInfo] = useState(true)

    return (
        <div className='notificationsHeaderContainer'>
            <h3>Notificaciones</h3>
            <div className="notificationsContainer">

                <div className="notificationBx"
                    onClick={() => setHideInfo(!hideInfo)}
                >
                    <span className='notificationTitle'>Equipo 1 | T: 30.5° | H: 84%</span>
                    {
                        !hideInfo &&
                        <div className="notificationInfo">
                            <span>Camas: 1-10</span>
                            <span>Fecha: 1-10</span>
                            <span>Hora: 1-10</span>
                            <span>Temperatura: 30.5°</span>
                            <span>Humedad: 84%</span>
                        </div>
                    }

                </div>

            </div>
        </div>
    )
}

export default NotificationsHeader