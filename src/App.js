import React, { Component } from 'react';
import styled               from 'styled-components';
import { ScrollBar }        from './components';


const Wrapper=styled.div`
	width: 250px;
	height: 400px;
	margin: 50px auto;
	box-shadow: 0 2px 16px hsla(0,0%,0%, 0.15);
`;

const Item=styled.div`
	padding: 4px 8px;
	border-bottom: 1px solid hsla(0,0%,0%,0.15);
`;

const generateList=(length=50)=>new Array(length).fill(0).map((elem, id)=>({ id, name: `${id}_name` }));

class App extends Component{
	constructor(){
		super();
		this.state={
			list: []
		};
	}

	componentDidMount=()=>{
		this.setState({
			list: generateList()
		});
	};

	render(){
		return (
			<Wrapper>
				<ScrollBar>
					{
						this.state.list.map(elem=>
							<Item key={elem.id}>
								{elem.name}
							</Item>
						)
					}
				</ScrollBar>
			</Wrapper>
		);
	}
}

export default App;
