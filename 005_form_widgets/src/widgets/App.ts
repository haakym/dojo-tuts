import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainer from './WorkerContainer';
import { WorkerProperties } from './Worker';
import WorkerForm, { WorkerFormData } from './WorkerForm';

export default class App extends WidgetBase {
	private _workerData: WorkerProperties[] = [
		{
			firstName: 'Tim',
			lastName: 'Jones',
			email: 'tim.jones@bizecorp.org',
			tasks: [
				'6267 - Untangle paperclips',
				'4384 - Shred documents',
				'9663 - Digitize 1985 archive'
			]
		},
		{
			firstName: 'Alicia',
			lastName: 'Fitzgerald'
		},
		{
			firstName: 'Hans',
			lastName: 'Mueller'
		}
	];

	private _newWorker: Partial<WorkerFormData> = {};

	private _onFormInput(data: Partial<WorkerFormData>) {
		this._newWorker = {
			...this._newWorker,
			...data
		};
		this.invalidate();
	}

	private _addWorker() {
		this._workerData = this._workerData.concat(this._newWorker);
		this._newWorker = {};
		this.invalidate();
	}

	protected render() {
		return v('div', [
			w(Banner, {}),
			w(WorkerForm, {
				formData: this._newWorker,
				onFormInput: this._onFormInput,
				onFormSave: this._addWorker
			}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
