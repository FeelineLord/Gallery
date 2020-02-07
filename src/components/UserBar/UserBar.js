import React, {Component} from 'react';

import { SelectSize, SelectPage } from './SelectSettings';

export default class UserBar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  };

  render() {
    const { data, setSettings, className, theme } = this.props;
    return (
      <section className={'userBar ' + className}>
        <ul className='userBar__list'>
          <li className='userBar__item'>
            <SelectPage
              className='userBar__selectPage '
              data={data}
              setSettings={setSettings}
              theme={theme}
            >
            </SelectPage>
          </li>
          <li className='userBar__item'>
            <SelectSize
              className='userBar__selectSize '
              data={data}
              selectName='images size'
              setSettings={setSettings}
              theme={theme}>
            </SelectSize>
          </li>
        </ul>
      </section>
    );
  };
};