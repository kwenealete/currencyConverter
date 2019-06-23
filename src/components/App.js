import React from 'react';
import Header from './Header';
import Footer from './Footer';


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '/' + mm + '/' + dd;

class App extends React.Component {
  constructor(props){
    super(props)
    this.input = React.createRef();
    this.base = React.createRef();
    this.value = React.createRef();
  }
  state = {
      baseCurrency:'GBP',
      convertToCurrency:'USD',
      baseAmount: 1,
      rates: [],
      monyaCurrency:{'MKA': 1.2346} ,
      date:'latest',
      currencies: [],
      currentDate:today
  }

  // Function to enable change of base currency or convert from currency
  changeBaseCurrency =(e) => {
    this.setState({ baseCurrency: e.target.value});
   
    
  }
  
  // Function to enable change or make choice of desired convertTo currency
  changeConvertToCurrency = (e) => {
    this.setState({
      convertToCurrency: e.target.value
    });
  }
  
  // set base/initial amount function
  changeBaseAmount = (e) => {
   this.setState({
     baseAmount: e.target.value
   });
  }
  
  // Function to calculate the amount equivalent to convertToCurrency from base currency currency
  getConvertedCurrency = (baseAmount,convertToCurrency,rates) => {
      return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(4);
  }
 // function to get currency exchange with respect to specific dates
  changeDate=(e)=>{
    e.preventDefault();
    if(this.input.current.value==='') this.setState({date:'latest'})
    else this.setState({date:this.input.current.value})
    console.log(this.state.currentDate);
        
  }
  
  componentDidMount() {
    const {date, baseCurrency} = this.state
  const api = `http://data.fixer.io/api/${date}?access_key=ad814494ac07535f9ab09bd96e3f99d0&?base=${baseCurrency}`;
 fetch(api).then(res=>res.json())
    .then(data => this.setState({
      
      rates:  [data['rates']],
      currencies: Object.keys(data['rates']).sort()
    }));
    
    
  }
  componentDidUpdate() {
      const {date, baseCurrency} = this.state
      const api = `http://data.fixer.io/api/${date}?access_key=ad814494ac07535f9ab09bd96e3f99d0&?base=${baseCurrency}`;
     fetch(api).then(res=>res.json())
        .then(data => this.setState({
          
          rates:  data['rates'],
          currencies: Object.keys(data['rates']).sort()
        }));  
 }
  
  render() {
    const {currencies,rates,baseCurrency,baseAmount,convertToCurrency} = this.state;
    
    const currencyChoice = currencies.map(currency =>
      <option key={currency} value={currency}> {currency} </option>      
    );
                                          
    const result = this.getConvertedCurrency(baseAmount, convertToCurrency, rates); 
      
    return(
      <React.Fragment>
        <Header />
        <div className="form-container">
      
          <form className='ui mini form'>
                  
         <h3>Convert from: {baseCurrency}</h3>
          <select  value={baseCurrency} onChange={this.changeBaseCurrency}>
            {currencyChoice}
            <option>{baseCurrency}</option>
          </select>
        
          <h3>Convert to: {convertToCurrency}</h3>
          <select value={convertToCurrency} onChange={this.changeConvertToCurrency}>
            {currencyChoice}
          </select>
        
         <h3>Amount:</h3>
           <input type='number'  
                  id='base'
                  defaultValue={baseAmount} 
                  onChange={this.changeBaseAmount}>
          </input>
          <h3>Date:</h3>
           <input type='date'
           id="start" name="trip-start"
           min="1999-01-01" max={this.state.currentDate} 
                  placeholder='YYYY-MM-DD'
                  ref={this.input}>
          </input>
          <button onClick={this.changeDate}>Click</button>                                    
          </form>                       
          <h2 id='result-text'>{baseAmount} {baseCurrency} is equivalent to {result} {convertToCurrency}</h2>
       
        </div>
        <Footer />
      </React.Fragment>
       );
      
  }
}
 export default App
