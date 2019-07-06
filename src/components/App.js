import React from 'react';
import axios from 'axios';
import Header from './Header'
import Footer from './Footer'


class App extends React.Component{

  state = {
    from: 'EUR',
    to: 'USD',
    amount: 1,
    result: '',
    date: 'latest',
    currencies: []
  }

  componentDidMount(){

    axios.get('http://data.fixer.io/api/latest?access_key=eff15d471c7ba065a8cb7ebc4672cb30')
      
      .then(res=>{
// Initialising currency array
        const currencyArray= ['USD']
        for (const key in res.data.rates){
          currencyArray.push(key)          
        }

        this.setState({currencies: currencyArray})
      })
      .catch(err=>{
        console.log('sorry', err.message);
        
      })
  }
// converting a currency to euros and getting the equivalent in a prefered currency 
   getExchangeRate = async () => {
     try{
    
        const response = await axios.get(`http://data.fixer.io/api/${this.state.date}?access_key=eff15d471c7ba065a8cb7ebc4672cb30`);
    const euro = 1/response.data.rates[this.state.from];
         const rate = (euro * response.data.rates[this.state.to]) * this.state.amount;
         

         if (isNaN(rate)) {
             throw new Error();
         }

         this.setState({result: rate})
        }catch (error) {
          alert (`Unable to get exchange rate for ${this.state.from} and ${this.state.to} for ${this.state.date}.`);
       }  
         
 };
 


  render() {
    return (
      <div className="Converter" >
        <Header />
        <div className="Form" >
          <input 
          name="amount"
          type="number"
          value={this.state.amount}
          placeholder="Enter amount"
          onChange={e => this.setState({amount:e.target.value})}
          />
          <select
          name='from'
          value={this.state.from}
          onChange={e=> this.setState({from:e.target.value})} >
            {this.state.currencies.map(currency =>(
              <option key={currency} value={currency} >{currency}</option>
            ))}
          </select>
          <select
          name='to'
          value={this.state.to}
          onChange={e=>this.setState({to: e.target.value})} >
            {this.state.currencies.map(currency=> (
              <option key={currency} value={currency} > {currency} </option>
            ))}
          </select>
          <input 
          name='Date'
          type="text"
          value={this.state.date}
          placeholder="enter date format yyyy-mm-dd"
          onChange={e=>this.setState({date:e.target.value})} />
          <button onClick={this.getExchangeRate} >Convert</button>
        </div>
        {this.state.result &&(
          <h3>{this.state.result}</h3>
        )}
        <Footer />
      </div>
    )
  }

}

export default App


