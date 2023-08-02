import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { config } from '../config'
import { CSVLink } from "react-csv";
import { ExportToExcel } from './ExportToExcel'
import { BiHome } from 'react-icons/bi';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import IndicatorCard from './IndicatorCard'
import SideNavBar from './SideNavBar'
import useMqtt from '../hooks/useMqtt'
import { signal } from '@preact/signals-react'


const ChartStation = () => {

    const cont = signal(0)

    const { station } = useParams()
    console.log(station)
    const navigate = useNavigate()


    const digits = (num) => {
        let digit = num < 10 ? '0' + num : num + ''
        return digit
    }

    const formatDate = (date) => {
        const fecha = new Date(date)
        let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate())
        return stringDate
    }
    const formatDate1 = (date) => {
        const fecha = new Date(date)
        let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate() + 2)
        return stringDate
    }

    const formatTime = (date) => {
        const time = new Date(date)
        let stringTime = digits(time.getHours() + ':' + digits(time.getMinutes()))
        return stringTime
    }


    const options = {
        backgroundColor: '#848484',
        color: "#212121"
    }

    const [itemInfo, setItemInfo] = useState()
    const [stationInfo, setStationInfo] = useState()
    const [registers, setRegisters] = useState()
    const [allRegisters, setAllRegisters] = useState([])
    const [csv, setCsv] = useState([])
    const [data, setData] = useState()
    const [download, setDownload] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [from, setFrom] = useState(formatDate(new Date()))
    const [to, setTo] = useState(formatDate(new Date()))
    const [rangeType, setRangeType] = useState('day')

    const { mqttSubscribe, isConnected, payload } = useMqtt();
    const [notificationList, setNotificationList] = useState([]);


    const getLastInfo = () => {
        let url = config.db.baseurl + 'registers/' + station + '/last'
        console.log(url)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setItemInfo(response.data)
            })
            .catch(err => console.log(err))
    }


    const getStation = () => {
        let url = config.db.baseurl + 'stations/' + station
        console.log(url)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setStationInfo(response.data)
                console.log(stationInfo)
            })
            .catch(err => console.log(err))
    }


    const getRegistersRange = (from, to) => {
        console.log(from)
        let url = config.db.baseurl + 'registers/' + station + '/date?'
            + 'from=' + from
            + '&to=' + to
        console.log(url)
        setFetching(true)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setRegisters(response.data)
                setRangeType(response.data[0].type)
                console.log(response.data[0].type)
                setFetching(false)
            })
            .catch(err => console.log(err.data))
    }

    const getAllRegisters = () => {
        let url = config.db.baseurl + 'registers/' + station
        console.log(url)
        setFetching(true)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setAllRegisters(response.data)
                setFetching(false)
            })
            .catch(err => console.log(err.data))
    }

    const handleFromTo = (e, type) => {
        console.log(e, type)
        switch (type) {
            case 'from':
                setFrom(e)
                break;
            case 'to':
                setTo(e)
                break;
            default:
                break;
        }

        from !== to &&
            getRegistersRange(from, to)

    }

    const formatData = (data) => {
        let dataformat = data?.map((reg, index) => ({ date: formatDate(reg.date), time: formatTime(reg.createdAt), t: reg.temp, h: reg.hum }))
        return dataformat
    }
    const formatCsv = (data) => {
        let csvformat = data?.map((reg, index) => ({ device: station, fecha: formatDate(reg.date), hora: formatTime(reg.createdAt), t: reg.temp, h: reg.hum }))
        return csvformat
    }


    useEffect(() => {
        getStation()
    }, [station])


    useEffect(() => {
        getRegistersRange(from, to)
        getLastInfo()
    }, [payload])

    useEffect(() => {
        console.log(from)
        console.log(to)
        getRegistersRange(from, to)
    }, [from, to])

    useEffect(() => {
        setData(formatData(registers))
    }, [registers])

    useEffect(() => {
        setCsv(formatCsv(allRegisters))
    }, [allRegisters])


    useEffect(() => {
        if (isConnected) {
            mqttSubscribe('miracleF01/devices');
        }
    }, [isConnected]);

    useEffect(() => {
        if (payload.message
            && ['miracleF01/devices'].includes(payload.topic)
        ) {
            // const newMessage = JSON.parse(payload.message);
            const newMessage = payload.message;
            console.log(newMessage)
            alert('new date')
            // const jsplit = newMessage.split('|')
            // // { "station": "ESP1", "values": { "H": 74.2, "T": 25.5 }, "createdAt": new Date() }
            // const createdAt = new Date()
            // console.log(createdAt)
            // const jsonObj = { station: "ESP1", values: { H: jsplit[0], T: jsplit[1] }, createdAt: new Date() }
            // // setItemInfo(jsonObj)
            // // console.log(jsonObj)
            // // setRegisters([...registers, jsonObj])
            // // const notif = [...notificationList, newMessage]
            // // setNotificationList(notif)
            // // new Notification(newMessage.content);
            // // postData(JSON.parse(jsonObj))

        }
    }, [payload]);


    return (
        <div className=''>

            <SideNavBar />

            <div className="navBarContainer">
                <div className="navBarContainer_header">

                    <button
                        className='navButton'
                        onClick={() => navigate('/')}
                        disabled={download && fetching}
                    > <BiHome />Inicio</button>

                    {/* <button
                className='HomeButton'
                onClick={() => getRegistersRange(from, to)}
                disabled={download && fetching}
            >Actualizar</button> */}

                    <h1 className='chartTitle'>{stationInfo?.alias}</h1>


                    {!allRegisters.length > 0 &&
                        <button
                            className='navButton'
                            onClick={() => getAllRegisters()}
                            disabled={download && fetching}
                        >Obtener todos los datos <PiMicrosoftExcelLogo /></button>
                    }
                    {allRegisters.length > 0 &&
                        <ExportToExcel
                            apiData={csv}
                            fileName={`${station}`}
                            station={station}
                            setDownload={setDownload}
                            fetching={fetching}
                        />

                        // <CSVLink
                        //     className='downLoadBtn'
                        //     data={csv}
                        //     filename={`${station}.csv`}
                        // // headers={headers}
                        // >
                        //     Descargar CSV
                        // </CSVLink>
                    }

                </div>

                <div className="navBarContainer_body">
                    <div className="">
                        <span className="bodyStationCard_label">Id: </span>
                        <span className="bodyStationCard_text">{stationInfo?.title}</span>
                    </div>
                    <div className="">
                        <span className="bodyStationCard_label">Camas: </span>
                        <span className="bodyStationCard_text">{stationInfo?.beds}</span>
                    </div>
                    <div className="">
                        <span className="bodyStationCard_label">Flor: </span>
                        <span className="bodyStationCard_text">{stationInfo?.flowername}</span>
                    </div>
                </div>

            </div>


            <div className="dateContainer">
                <div className="dateField">
                    <label htmlFor="">Desde:</label>
                    <input type="date"
                        value={from}
                        onChange={(e) => handleFromTo(e.target.value, 'from')}
                    />
                </div>
                <div className="dateField">
                    <label htmlFor="">Hasta:</label>
                    <input type="date"
                        value={to}
                        onChange={(e) => handleFromTo(e.target.value, 'to')}
                    />
                </div>

                {/* <button onClick={() => cont.value++} >hola: {cont}</button> */}

            </div>

            <div className="indicatorsContainer">

                <IndicatorCard
                    type={'temp'}
                    value={itemInfo ? itemInfo?.temp : 0}
                    status={1}
                    min={stationInfo?.tempRange.min}
                    max={stationInfo?.tempRange.max}
                    payload={payload}
                    stationInfo={stationInfo}
                />
                <IndicatorCard
                    type={'hum'}
                    value={itemInfo ? itemInfo?.hum : 0}
                    status={1}
                    min={stationInfo?.humRange.min}
                    max={stationInfo?.humRange.max}
                    payload={payload}
                    stationInfo={stationInfo}
                />

            </div>
            {/* <h1 className='chartTitle'>{stationInfo?.alias}</h1> */}

            <div className="chartsContainer">

                <div className="chartContainer">
                    <h3>Temperatura</h3>
                    <span className='y_axisLabel'>Temp °C</span>

                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
                        <Line type="monotone" dataKey="t"
                            stroke={config.styles.linecolor}
                            strokeWidth={config.styles.linewidth}
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey={rangeType === 'hour' ? 'time' : 'date'} />
                        <YAxis dataKey={"t"} />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>

                    <div className='x_axisLabel'>Hora</div>
                </div>

                <div className="chartContainer">
                    <h3>Humedad</h3>
                    <span className='y_axisLabel'>humedad%</span>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="h"
                            stroke={config.styles.linecolor}
                            strokeWidth={config.styles.linewidth}
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
                        <XAxis dataKey={rangeType === 'hour' ? 'time' : 'date'} />
                        <YAxis dataKey={"h"} />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>
                    <div className='x_axisLabel'>Hora</div>

                </div>

            </div>

        </div>
    )
}

export default ChartStation