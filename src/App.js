import React, { useState } from 'react'
import './App.css'

function App() {
	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedTimeWindow, setSelectedTimeWindow] = useState(null)
	const [selectedServices, setSelectedServices] = useState([])

	const response = [
		{
			deliveryDate: '2019-04-25',
			price: 250,
			timeWindows: [
				{
					timeWindow: '0800-1000',
					services: [{ type: 'BRING', fee: 200 }]
				},
				{
					timeWindow: '1000-1200',
					services: [
						{ type: 'BRING', fee: 200 }
					]
				},
				{
					timeWindow: '1200-1400',
					services: [
						{ type: 'BRING', fee: 200 }
					]
				}
			]
		},
		{
			deliveryDate: '2019-04-26',
			price: 125,
			timeWindows: [
				{
					timeWindow: '0800-1000',
					services: [{ type: 'BRING', fee: 200 }]
				},
				{
					timeWindow: '1000-1200',
					services: [
						{ type: 'PACKAGING', fee: 100 },
						{ type: 'BRING', fee: 200 }
					]
				},
				{
					timeWindow: '1200-1400',
					services: [
						{ type: 'PACKAGING', fee: 100 },
						{ type: 'BRING', fee: 200 }
					]
				}
			]
		},
		{
			deliveryDate: '2019-04-27',
			price: 0,
			timeWindows: [
				{
					timeWindow: '0800-1000',
					services: [{ type: 'BRING', fee: 200 }]
				},
				{
					timeWindow: '1000-1200',
					services: [
						{ type: 'CRANE', fee: 1000 },
						{ type: 'BRING', fee: 200 }
					]
				},
				{
					timeWindow: '1200-1400',
					services: [
						{ type: 'CRANE', fee: 1000 },
						{ type: 'PACKAGING', fee: 100 },
						{ type: 'BRING', fee: 200 }
					]
				}
			]
		}
	]

	const deliveryDates = response.map(({ deliveryDate }) => deliveryDate)

	const services = (date) => {
	  const { timeWindows } = response.find(({deliveryDate}) => deliveryDate === date)
    const list = []
    
    timeWindows.forEach(({timeWindow, services}) => {
      services.forEach(service => {
        const existingServiceType = list.find(({type}) => type === service.type)
        if (existingServiceType) {
          existingServiceType.timeWindows.push(timeWindow)
        } else {
          list.push({ type: service.type, timeWindows: [timeWindow]})
        }
        
      })
    })

    return list
	}

	const timeWindows = date => {
		const { timeWindows } = response.find(
			({ deliveryDate }) => deliveryDate === date
		)
		return timeWindows.map(({ timeWindow, services }) => ({
			timeWindow: timeWindow,
			services: services.map(({ type }) => type)
		}))
  }
  
  function allServicesIncluded(servicesOffered, servicesDemanded) {
    let allServicesIncluded = true
    servicesDemanded.forEach(service => {
      if (!servicesOffered.includes(service)) {
        allServicesIncluded = false
      }
    })
    return allServicesIncluded
  }

  const selectedStyle = (state, stateToCheck) => {
    const style = {
      borderColor: 'transparent',
      color: 'seagreen',
      backgroundColor: 'palegreen'
    }

    if (Array.isArray(stateToCheck)) {
      return stateToCheck.includes(state) ? style : {}
    } else {
      return state === stateToCheck ? style : {}
    }
  }

  const price = (date, time, servicesDemanded) => {
    let total = 0
    const getServicesTotalFee = (total, {type, fee}) => {
      console.log({
        total: total,
        type: type,
        fee: fee
      })
      if (servicesDemanded.includes(type)) {
        return total += fee
      }
      return total
    }

    if (date) {
      const {timeWindows, price} = response.find(({deliveryDate}) => deliveryDate === date)
      total += price
      if (time) {
        const {services} = timeWindows.find(({timeWindow}) => timeWindow === time)
        total += services.reduce(getServicesTotalFee, 0)
      }
    }
    
    return total

  }

	return (
		<div className="App">
			<header className="App-header">
        <nav>
          {deliveryDates.map(date => (
            <button 
            onClick={() => setSelectedDate(date)}
            style = {selectedStyle(date, selectedDate)}
            >{date}</button>
          ))}
        </nav>
			</header>
      <main>
          <section>
            {selectedDate && <h2>CHOOSE TIME</h2> }
            {selectedDate && timeWindows(selectedDate).map(({timeWindow, services}) => (
              <button
              disabled = { selectedServices.length > 0 && !allServicesIncluded(services, selectedServices) }
              style = {selectedStyle(timeWindow, selectedTimeWindow)}
              onClick={() => setSelectedTimeWindow(selectedTimeWindow === timeWindow ? null : timeWindow )}
              >{timeWindow}</button>
            ))}
          </section>
          <section>
            {selectedDate && <h2>SELECT SERVICES</h2> }
            {selectedDate && services(selectedDate).map(({type, timeWindows}) => (
              <button 
              disabled = { selectedTimeWindow && !timeWindows.includes(selectedTimeWindow) }
              style = {selectedStyle(type, selectedServices)}
              onClick={() => setSelectedServices(selectedServices.includes(type) ? selectedServices.filter(selectedType => selectedType !== type): [...selectedServices, type])}
              >{type}</button>
            ))}
          </section>
        </main>
        PRICE {price(selectedDate, selectedTimeWindow, selectedServices)}
		</div>
	)
}

export default App
