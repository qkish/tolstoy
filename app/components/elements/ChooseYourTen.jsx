import React, { Component } from 'react'
import Select from 'react-select'
import { getUsersByCategory, updateUserTen } from 'app/utils/ServerApiClient'
// import UserEdit from 'app/components/elements/UserEdit'
import 'react-select/dist/react-select.css'

class ChooseYourTen extends Component {
	constructor (props) {
		super(props)
		this.state = {}

		this.updateValue = this.updateValue.bind(this)
		this.getData = this.getData.bind(this)
	}

	updateValue (newValue) {
		console.log(newValue)
		this.setState({
			selectValue: newValue
		})
		updateUserTen(this.props.user, { ten: newValue.value || null })
	}

	getData () {
		return getUsersByCategory('tens', 0, 1000, 'first_name')
		.then(data => {
			const res = data.map(x => ({
				value: x.id,
				label: `${x.first_name} ${x.last_name}`,
				name: x.name
			}))
			return { options: res }
		})
	}

	render () {
		// const User = props => <UserEdit account={props.option.value.name} />

		return (
			<div className="PostSummary" style={{marginLeft: "10px"}}>
				<h5>Выберите своего десятника</h5>
				<Select.Async
					name='chooseYourTen'
					value={this.state.selectValue}
					clearable={false}
					// optionComponent={User}
					placeholder='Выберите своего десятника'
					loadOptions={this.getData}
					onChange={this.updateValue} />
			</div>
		)
	}
}

export default ChooseYourTen



{/* <select onChange={({ target }) => this.handleTenChange({ id: userID, ten: target.value })}>
<option>Не выбран десятник</option>
  {allTens ? allTens.map(userOption => (
          <option key={userOption.id} value={userOption.id}>
              {`${userOption.first_name} ${userOption.last_name}`}
          </option>
      )) : null}
</select> */}
