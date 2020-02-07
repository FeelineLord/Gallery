import React, {Component} from 'react';

export class SelectAmount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      changed: false
    };

  };

  componentDidMount() {
    this.setState({
      amount: this.props.data.settings.imagesPerPage
    });
  };

  handleChange = (event) => {
    event.preventDefault();
    if (event.target.value > 999 || isNaN(event.target.value)) {
      return ;
    }; 
    this.setState({
      amount: event.target.value,
      changed: true
    });
  };

  handleSubmit = () => {
    if (!this.state.changed) {
      return ;
    } 
    
    let amount = this.state.amount > 100
      ? 100
      : this.state.amount < 50 
        ? 50 
        : this.state.amount;
    this.setState({
      amount,
      changed: false
    }, () => {
      this.props.setSettings(this.props.data, 'imgAmount', amount);
      this.props.createTempPages(this.props.data);
    });
  };

  render() {
    const { className, selectName, theme } = this.props;
    const { amount } = this.state;
    return(
      <label 
        className={'selectAmount ' + className}
        style={this.props.currentPage !== 1 ? {'display': 'none'} : {'display': 'flex'}}>
        {selectName}
        <input 
          className='selectAmount__input'
          value={amount}
          onChange={this.handleChange}
          onBlur={this.handleSubmit}
          style={theme === 'fantasy' 
            ? { 'boxShadow': 'inset 0px 0px 21px 0px rgba(0,0,0,0.75)',
                'border': '2px solid black'} 
            : { 'boxShadow': 'inset 0px 0px 21px 0px rgba(33, 31, 131, 0.75)',
                'border': 'none'}
          }>
        </input>
        <span 
          className='selectAmount__advice'>
          min: 50, max: 100
        </span>
      </label>
    );
  };
};

export class SelectTheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTheme: 'fantasy'
    };
  };

  componentDidMount() {
    this.setState({
      currentTheme: this.props.data.settings.theme
    });
  };

  handleClick = (requiredTheme) => {
    this.setState({
      currentTheme: requiredTheme
    }, () => {
      this.props.setSettings(this.props.data, 'themeChange', requiredTheme);
    });
  };

  render() {
    const { selectName, className } = this.props;
    const { currentTheme } = this.state;
    return(
      <div 
        className={'selectTheme ' + className}>
        {selectName}
        <span
          className={
            `selectTheme__checkbox selectTheme__checkbox_fantasy ${currentTheme === 'fantasy' ? 'selectTheme__checkbox_current' : ''}`
          }
          onClick={() => {this.handleClick('fantasy')}}>
        &#10004;
        </span>
        <span 
          className={
            `selectTheme__checkbox selectTheme__checkbox_light ${currentTheme === 'light' ? 'selectTheme__checkbox_current' : ''}`
          }
          onClick={() => {this.handleClick('light')}}>
          &#10004;
        </span>
      </div>
    );
  };
};