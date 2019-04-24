// MODELS
class Portfolio {
    constructor(stocks = [] , begin_value = 10000){
        this.stocks = stocks;
        this.begin_value = begin_value;
        this.actual_value = this.begin_value;
    }

    profit(start_date, end_date){

        let profit = 0;
        let start = new Date(start_date);
        let end = new Date(end_date);

        // ITERATE STOCK IN THE PORTFOLIO
        this.stocks.forEach(stock => {
            // get stock date
            const stock_date = new Date(stock.getDate());
            // check if is in range then add to profit
            if( 
                stock_date.getTime() >= start.getTime() 
                &&
                stock_date.getTime() <= end.getTime()
            ){
                profit = Number(stock.getPrice()) + Number(profit);
            }
        });

        return profit;
    }

    // getters this.stocks
    getStocks(){
        return this.stocks;
    }

    getBeginValue(){
        return Number(this.begin_value).toLocaleString();
    }

    getActualValue(){
        return Number(this.actual_value).toLocaleString();
    }

    // setters 
    addStock(stock){
        this.stocks.push(stock);
        this.actual_value = Number(this.actual_value) + Number(stock.price);
    }

    //controllers
    getOverallReturn(){
        /* 
                  Ending Value - Beginning Value
        Return =  -------------------------------
                          Beginning Value
        */
        const overall = (Number(this.actual_value) - Number(this.begin_value))/Number(this.begin_value);
        return Number(overall);
    }

    getAnnualizedReturn(start_date, end_date){
        // Annualized Return=(1 + Overall Return)^1/N - 1
        // N = years or diff_years(end_date, start_date)
        let start       = new Date(start_date);
        let end         = new Date(end_date);
        let overall     = this.getOverallReturn();
        let n           = diff_years(end, start);
        let annualized  = 0;
        if(n > 0 ){
            annualized  = Math.pow(1 + overall, 1/n) - 1;
        }
        
        return Number(annualized);
    }
}

class Stocks {
    constructor(
        name          = 'Stock X',
        price         = 0,
        date          = Date.now()
    )
    {
        this.name         = name;
        this.price        = price;
        this.date         = date;
    }

    

    getPriceByDate(date){
        if(date == this.date){
            return this.date;
        }

        return null;
    }

    // Getter this.date
    getName(){
        return this.name;
    }

    getDate(){
        return this.date;
    }

    getPrice(){
        return this.price;
    }
}



// UI CLASS FOR PORTFOLIO CONTROLLER
class UI {

    setupAPP(){

        this.resetFields();

        portfolio_value_span.innerHTML = portfolio.getActualValue();
        begin_value_span.innerHTML     = portfolio.getBeginValue();

        if(portfolio.getStocks().length <= 0){
            portfoliosDOM.innerHTML = `<div class="alert alert-info">No Stocks in this PortFolio Yet... Add Some =)</div>`;
        } else {
            portfoliosDOM.innerHTML = '';
            this.displayStocks(portfolio.getStocks());
        }
    }

    resetFields(){
        stock_name_input.value  = '';
        stock_price_input.value = '';
        stock_date_input.value  = '';
    }

    displayStocks(stocks) {        
        portfoliosDOM.appendChild(this.buildStocksTable(stocks));

    }

    buildStocksTable(stocks){

        var table = document.createElement("table");
        table.className = "table table-hover";
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        var headRow = document.createElement("tr");

        ["Stock","G/L $","Date"].forEach(function(el) {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(el));
            headRow.appendChild(th);
        });

        thead.appendChild(headRow);
        table.appendChild(thead); 

        stocks.forEach(function(el) {
            var tr = document.createElement("tr");
            for (var o in el) {  
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(el[o]))
                tr.appendChild(td);
            }
            tbody.appendChild(tr);  
        });

        table.appendChild(tbody);  

        return table;
    }

    renderProfit(profit = 0, overall = 0, annualized = 0){
        report_div.innerHTML = '';
        let result = '';
        result += `    
        <div class="row p-2">
            <span class="mr-auto">Total Profit: </span>
            <span class="ml-auto">${Number(profit).toFixed(2)}</span>
        </div>

        <div class="row p-2">
            <span class="mr-auto">Overall Return: </span>
            <span class="ml-auto">${Number(overall).toFixed(4)}</span>
        </div>

        <div class="row p-2">
            <span class="mr-auto">Annualized Return: </span>
            <span class="ml-auto">${Number(annualized).toFixed(4)}</span>
        </div>
        `;
        report_div.innerHTML = result;
    }
}

// VARIABLES GLOBALS
let portfolio          = new Portfolio();

// DOM ELEMENTS
const portfoliosDOM         = document.querySelector('.portfolio-list');
const stock_name_input      = document.getElementById('input-new-stock-name');
const stock_price_input     = document.getElementById('input-new-stock-price');
const stock_date_input      = document.getElementById('input-new-stock-date');
const start_date_input      = document.getElementById('input-from');
const end_date_input        = document.getElementById('input-to');
const report_div            = document.getElementById('report');
const portfolio_value_span  = document.getElementById('portfolio-value');
const begin_value_span      = document.getElementById('portfolio-begin-value');

// INITIALIZE
document.addEventListener("DOMContentLoaded" , () => {

    const ui        = new UI();

    //setup app UI
    ui.setupAPP();

    // setup actions and listeners
    document.getElementById('btn-new-portfolio')
	.addEventListener('click', e => {
        e.preventDefault();

		const stock_name 	     = stock_name_input.value;
		const stock_price 	     = stock_price_input.value;
        const stock_date 	     = stock_date_input.value;

        const stock = new Stocks(stock_name, stock_price, stock_date);
        portfolio.addStock(stock);
        
		ui.setupAPP();
		
    });
    
    document.getElementById('btn-calculate-profit')
	.addEventListener('click', e => {
        e.preventDefault();

		const start_date = start_date_input.value;
        const end_date   = end_date_input.value;
        
        const profit        = portfolio.profit(start_date, end_date);
        const overall       = portfolio.getOverallReturn();
        const annualized    = portfolio.getAnnualizedReturn(start_date, end_date);
		ui.renderProfit(profit, overall, annualized);
		
	});
});

// HELPER FUNCTION
function diff_years(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24);
  return Math.abs(Math.round(diff/365.25));
   
 }
