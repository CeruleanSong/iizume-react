/**
 * Library.ts
 * - Handles interactions with manga saved in library.
 * - Handles navigation to other routes.
 * Notes:
 * Created 19-04-11
 * @author Elias Mawa <elias@emawa.io>
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigationStackProp } from 'react-navigation-stack';

import { getLatest } from '../../core/source/Source';
import { Sources, SourceType } from '../../core/source/SourceList';
import { Preview } from '../../lib/manga/Preview';
import StyledHeader from '../Components/StyledHeader';
import StyledStaticFlatList from '../Components/StyledStaticFlatList';
import Shelf from '../Shared/Shelf';

interface LibraryProps {
	navigation: NavigationStackProp;
}

interface BrowseState {
	list: Preview[];
	page: number;
	refreshing: boolean;
}

interface BrowseProps {
	navigation: NavigationStackProp;
}

class BrowseTabView extends Component<BrowseProps, BrowseState> {
	constructor(props: BrowseProps){
		super(props);
		this.state = {
			list: [],
			page: 1,
			refreshing: false,
		};
	}

	public async componentDidMount() {
		await getLatest(Sources.mangasee).then((res) => {
			this.setState({list: res ?? []});
		});
	}

	public render() {
		const onScrollHandler = async () => {
			if (!this.state.refreshing) {
				this.setState({page: this.state.page, list: this.state.list, refreshing: true});
				const res = await getLatest(Sources.mangasee, this.state.page + 1);

				const list = this.state.list?.concat(res ? res : []);

				this.setState({page: this.state.page + 1, list, refreshing: false});
			}
		};

		const pushBrowser = (state: SourceType) => {
			this.props.navigation.push('BrowseTabNavigator');
		};

		return (
			<View style={{}} >
				<Shelf list={this.state.list} onReachEnd={onScrollHandler} onSelect={(item) => console.warn("Pressed", item.id ?? item.title)}/>
			</View>
		);
	}
}

/*************** Styles ***************/

const styles = StyleSheet.create({
	Shelf: {
		// position: 'absolute',
		// top: 0,

		// height: '95%',
		width: '100%',

		marginBottom: '20%',
	},
	Footer: {
		position: 'absolute',
		top: '90%',

		height: '5%',
		width: '100%',
	},
});

export default BrowseTabView;