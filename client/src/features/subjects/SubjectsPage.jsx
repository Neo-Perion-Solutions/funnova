import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import FilterBar from '../../components/shared/FilterBar';
import SubjectTable from './components/SubjectTable';
import SubjectModal from './components/SubjectModal';
import { useSubjects, useSubjectMutations } from './hooks/useSubjects';
import { useUIStore } from '../../store/uiStore';

const SubjectsPage = () => {
  const [filters, setFilters] = useState({ grade: '' });
  const { data: subjects, isLoading } = useSubjects(filters);
  const { create, update } = useSubjectMutations();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const onSave = async (data) => {
    if (activeModal === 'editSubject') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync(data);
    }
    closeModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Curriculum: Subjects"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal('addSubject')}
          >
            Add Subject
          </Button>
        }
      />

      <FilterBar
        filters={[
          {
            key: 'grade',
            label: 'Filter by Grade',
            type: 'select',
            options: [
              { label: 'All Grades', value: '' },
              { label: 'Grade 3', value: '3' },
              { label: 'Grade 4', value: '4' },
              { label: 'Grade 5', value: '5' },
            ],
          },
        ]}
        values={filters}
        onChange={(key, val) => setFilters({ [key]: val })}
        onReset={() => setFilters({ grade: '' })}
      />

      <SubjectTable
        data={subjects || []}
        isLoading={isLoading}
        onEdit={(subj) => openModal('editSubject', subj)}
      />

      <SubjectModal
        isOpen={activeModal === 'addSubject' || activeModal === 'editSubject'}
        onClose={closeModal}
        onSave={onSave}
        subject={activeModal === 'editSubject' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />
    </div>
  );
};

export default SubjectsPage;
