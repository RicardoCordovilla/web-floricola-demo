import React, { useEffect, useState } from 'react'
import GaugeChart from 'react-gauge-chart'

const Gauge = ({ min, max, value }) => {
    const percent = 1 - ((max - value) / (max - min))

    // const [animate, setAnimate] = useState(true)
    // useEffect(() => { }, [update])


    return (
        <>
            <GaugeChart id="gauge-chart2"
                animate={false}
                nrOfLevels={3}
                colors={["#6520d3", "#14e914", "#f34009"]}
                // arcWidth={0.3}
                percent={percent}
                style={{ height: '7rem' }}
                // formatTextValue={(value) => value + '%'}
                hideText={true}
                needleColor='#def'
                animateDuration={1000}
            // animDelay={500}
            />
        </>
    )
}

export default Gauge