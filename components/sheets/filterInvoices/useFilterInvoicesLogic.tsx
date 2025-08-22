import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import FormSchema, { FilterInvoicesFormValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import useGetInvoices from '@network/useGetInvoices';
import IProject from '@models/entities/IProject';
import { useAuth } from '@presenters/auth/AuthContext';
import { useInvoicesContext } from '@presenters/invoices/context/InvoicesContext';
import CONSTANTS from '@constants/constants';
import { SheetManager } from 'react-native-actions-sheet';

export default function useFilterInvoicesLogic() {
	const [selectedFilterType, setSelectedFilterType] = useState<'month' | 'project' | null>('month');
	const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
	const { loginType } = useAuth();
	const { filteredProjectId, setFilteredProjectId, filteredMonth, setFilteredMonth, filteredYear, setFilteredYear } = useInvoicesContext();
	const owner_type = loginType === 'producer' ? 'producer' : 'talent';
	const queryClient = useQueryClient();

	const { data } = useGetInvoices(filteredProjectId, filteredMonth, filteredYear);

	const InvoicesProjects = useMemo(() => {
		if (!data) return [];
		return data.reduce((acc, invoice) => {
			if (!acc.some(project => project.id === invoice.project_id)) {
				acc.push({
					id: invoice.project_id,
					name: invoice.project_name,
					film_type: invoice.film_type,
				});
			}
			return acc;
		}, []);
	}, [data]);

	const form = useForm<FilterInvoicesFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			month: { value: '', name: '' },
			year: { value: '', name: '' },
			project: { id: '', name: '' },
		},
	});

	// Update form values when filteredMonth or filteredYear change
	useEffect(() => {
		if (filteredMonth) {
			const monthObject = CONSTANTS.MONTHS.find(month => month.value === filteredMonth.toString());
			form.setValue('month', monthObject || null);
		}
		if (filteredYear) {
			const yearObject = CONSTANTS.YEARS.find(year => year.value === filteredYear.toString());
			form.setValue('year', yearObject || null);
		}
	}, [filteredMonth, filteredYear, form]);

	const handleMonthSortSelect = useCallback(() => {
		setSelectedFilterType(prevType => (prevType === 'month' ? null : 'month'));
	}, []);

	const handleProjectSortSelect = useCallback(() => {
		setSelectedFilterType(prevType => (prevType === 'project' ? null : 'project'));
		form.setValue('project', { id: '', name: '' });
	}, [form]);

	const handleProjectSelect = useCallback(
		(project: IProject) => {
			setFilteredProjectId(prev => (prev === project.id ? null : project.id));
			form.setValue('project', { id: project.id, name: project.name });
		},
		[form, setFilteredProjectId],
	);

	const filteredProjects = useMemo(() => {
		return InvoicesProjects.filter(project => project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()));
	}, [projectSearchQuery, InvoicesProjects]);

	const handleReset = useCallback(() => {
		form.reset({
			month: { value: '', name: '' },
			year: { value: '', name: '' },
			project: { id: '', name: '' },
		});
		setSelectedFilterType(null);
		setFilteredProjectId(null);
		setFilteredMonth(null);
		setFilteredYear(null);
		setProjectSearchQuery('');
	}, [form, setFilteredProjectId, setFilteredMonth, setFilteredYear]);

	const onSubmit = useCallback(
		async (data: FilterInvoicesFormValues) => {
			try {
				setFilteredProjectId(data.project.id || null);
				setFilteredMonth(data.month.value ? parseInt(data.month.value) : null);
				setFilteredYear(data.year.value ? parseInt(data.year.value) : null);

				queryClient.invalidateQueries({ queryKey: ['useGetInvoices', owner_type, data.project.id, data.year.value, data.month.value] });
				queryClient.invalidateQueries({ queryKey: ['useGetAllInvoicesSummary', data.project.id, data.year.value, data.month.value] });
				SheetManager.hide('Drawer');
			} catch (error) {
				form.setError('root', {
					message: 'An error occurred while fetching invoices. Please try again.',
				});
			}
		},
		[form, owner_type, queryClient, setFilteredProjectId, setFilteredMonth, setFilteredYear],
	);

	return {
		selectedFilterType,
		filteredProjectId,
		projectSearchQuery,
		form,
		filteredProjects,
		handleMonthSortSelect,
		handleProjectSortSelect,
		handleProjectSelect,
		setProjectSearchQuery,
		handleReset,
		onSubmit,
	};
}
