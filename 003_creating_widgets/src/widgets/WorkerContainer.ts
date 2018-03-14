import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { w, v } from '@dojo/widget-core/d';
import Worker from './Worker';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/workerContainer.m.css';

const WorkerContainerBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerContainer extends WorkerContainerBase {
	protected render() {
		const workers = [
			w(Worker, {
				key: '1',
				firstName: 'Tim',
				lastName: 'Jones'
			}),
			w(Worker, {
				key: '2',
				firstName: 'Alicia',
				lastName: 'Fitzgerald'
			}),
			w(Worker, {
				key: '3',
				firstName: 'Hans',
				lastName: 'Mueller'
			})
		];

		return v('div', {
			classes: this.theme(css.container)
		}, workers);
	}
}
