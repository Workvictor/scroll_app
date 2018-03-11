import React, { Component } from 'react';
import styled               from 'styled-components';


const Wrapper=styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
`;

const Content=styled.div`
	width: 100%;
	height: auto;
	position: relative;
	top: 0;
	left: 0;
	transition: all ${({ transition })=>transition || 0}ms;
	user-select: none;
`;

const TrackWrapper=styled.div`
	width: 4px;
	height: 100%;
	overflow: hidden;
	background-color: #fff;
	position: absolute;
	top: 0;
	right: 0;
	transition: all 300ms;
	opacity: ${({ visible })=>visible ? 1 : 0};
`;
const Track=styled.div`
	width: 4px;
	background-color: #868686;
	position: absolute;
	top: 0;
	left: 0;
	transition: all ${({ transition })=>transition || 0}ms;
`;

const getPosByBounds=(targetPos, targetMin, targetMax)=>(targetPos >= targetMin && targetPos <= targetMax) ? targetPos : targetPos < targetMin ? targetMin : targetMax;

export class ScrollBar extends Component{
	constructor(){
		super();
		this.state={
			focus: false,
			offsetHeight: 0,
			scrollHeight: 0,
			scrollTop: 0,
			trackHeight: 0,
			trackPos: {
				top: 0,
			},
			trackPicked: false,
		};
	}

	onMouseOver=()=>{
		const update=()=>{
			this.setState({
				focus: true,
				...this.measureWrapper(),
			});
		};
		!this.state.focus && update();
	};

	onMouseLeave=()=>{
		this.state.focus && this.setState({
			focus: false,
		});
	};

	measureWrapper=()=>{
		const offsetHeight=this.wrapper.offsetHeight;
		const scrollHeight=this.wrapper.scrollHeight;
		const trackHeight=Math.ceil((offsetHeight / scrollHeight) * 100);
		return {
			offsetHeight,
			scrollHeight,
			trackHeight
		};
	};

	onTrackPick=()=>{
		this.wrapper && this.setState({ trackPicked: true });
		window.addEventListener(`mouseup`, this.onTrackRelease);
		window.addEventListener(`mousemove`, this.onTrackMove);
	};

	onTrackRelease=()=>{
		window.removeEventListener(`mouseup`, this.onTrackRelease);
		window.removeEventListener(`mousemove`, this.onTrackMove);
		this.wrapper && this.setState({ trackPicked: false });
	};

	moveContent=delta=>{
		const getPixelsTransition=delta=>delta + this.state.scrollTop;
		const getPercentTransition=delta=>delta * this.state.scrollHeight;
		const getTransition=delta=>(delta >= 0 && delta <= 1) ? getPercentTransition(delta) : getPixelsTransition(delta);
		const scrollMin=0;
		const scrollMax=this.state.scrollHeight - this.state.offsetHeight;
		const transition=getTransition(delta);
		const scrollTop=getPosByBounds(transition, scrollMin, scrollMax);
		const trackPos={
			top: Math.floor((scrollTop / this.state.scrollHeight) * 100)
		};
		scrollTop !== this.state.scrollTop &&
		this.wrapper && this.setState({
			scrollTop,
			trackPos
		});
	};

	calculateTrackPos=event=>{
		const { offsetHeight, trackHeight }=this.state;
		const { pageY }=event;
		const rect=this.trackBar.getBoundingClientRect();
		const posYMax=100;
		const posYMin=0;
		const posY=(((pageY - rect.top) / offsetHeight) * 100) - trackHeight / 2;
		return {
			y: getPosByBounds(posY, posYMin, posYMax) / 100,
		};
	};

	onTrackClick=event=>{
		const { target }=event;
		const pos=this.calculateTrackPos(event);
		target === this.track &&
		this.onTrackPick(pos.y);
		this.moveContent(pos.y);
	};

	onTrackMove=event=>{
		const { trackPicked }=this.state;
		trackPicked && this.moveContent(this.calculateTrackPos(event).y);
	};

	onWheel=e=>{
		const { deltaY }=e;
		e.preventDefault();
		e.stopPropagation();
		this.moveContent(deltaY);
	};

	render(){
		return (
			<Wrapper
				innerRef={ref=>this.wrapper=ref}
				onMouseOver={this.onMouseOver}
				onMouseLeave={this.onMouseLeave}
				onWheel={this.onWheel}
			>
				<Content
					transition={this.state.trackPicked ? 0 : 300}
					style={{
						top: `${-this.state.scrollTop}px`
					}}
				>
					{this.props.children}
				</Content>
				<TrackWrapper
					innerRef={ref=>this.trackBar=ref}
					visible={this.state.focus}
					onMouseDown={this.onTrackClick}
				>
					<Track
						innerRef={ref=>this.track=ref}
						transition={this.state.trackPicked ? 0 : 300}
						style={{
							height: `${this.state.trackHeight}%`,
							top: `${this.state.trackPos.top}%`
						}}
					/>
				</TrackWrapper>
			</Wrapper>
		);
	}
}