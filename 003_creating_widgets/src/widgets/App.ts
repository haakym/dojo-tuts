import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainer from './WorkerContainer';

export default class App extends WidgetBase {
	protected render() {
		return v('div', [
			w(Banner, {}),
			w(WorkerContainer, {})
		]);
	}
}
