import { useCallback, useEffect, useState } from 'react';
import { mockProjects } from '@/lib/mockData';
import type { CommissionProject, ProjectStatus, ProjectMessage, ProgressImage } from '@/types';

export interface ProgressImageInput {
  imageUrl: string;
  caption: string;
  stage?: string;
}

const STORAGE_KEY = 'app_projects_v1';

function loadProjects(): CommissionProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CommissionProject[];
  } catch { /* ignore */ }
  return mockProjects;
}

function saveProjects(projects: CommissionProject[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch { /* ignore */ }
}

export function useProjectData() {
  const [projects, setProjects] = useState<CommissionProject[]>(loadProjects);

  useEffect(() => { saveProjects(projects); }, [projects]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const updateProjectStatus = useCallback(
    (projectId: string, status: ProjectStatus) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status } : p))
      );
    },
    []
  );

  const payDeposit = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                depositPaid: true,
                status: 'concept_stage' as ProjectStatus,
                payments: p.payments.map((pay) =>
                  pay.type === 'deposit' ? { ...pay, status: 'paid' as const, paidAt: new Date().toISOString() } : pay
                ),
                milestones: p.milestones.map((m, i) =>
                  i === 1 ? { ...m, status: 'done' as const } :
                  i === 2 ? { ...m, status: 'in_progress' as const } : m
                ),
              }
            : p
        )
      );
    },
    []
  );

  const markConceptReady = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status: 'concept_accepted' as ProjectStatus,
                milestones: p.milestones.map((m, i) =>
                  i === 2 ? { ...m, status: 'done' as const } :
                  i === 3 ? { ...m, status: 'in_progress' as const } : m
                ),
              }
            : p
        )
      );
    },
    []
  );

  const startPainting = useCallback(
    (projectId: string) => {
      updateProjectStatus(projectId, 'painting_in_progress');
    },
    [updateProjectStatus]
  );

  const uploadPreview = useCallback(
    (projectId: string, images: ProgressImageInput[]) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const newImages: ProgressImage[] = images.map((img, i) => ({
            id: `img-${Date.now()}-${i}`,
            projectId,
            imageUrl: img.imageUrl,
            caption: img.caption,
            stage: img.stage,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'artist',
          }));
          return {
            ...p,
            status: 'preview_uploaded' as ProjectStatus,
            progressImages: [...p.progressImages, ...newImages],
            milestones: p.milestones.map((m, i) =>
              i === 3 ? { ...m, status: 'done' as const } :
              i === 4 ? { ...m, status: 'in_progress' as const } : m
            ),
          };
        })
      );
    },
    []
  );

  const addProgressImage = useCallback(
    (projectId: string, image: ProgressImageInput) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const newImage: ProgressImage = {
            id: `img-${Date.now()}`,
            projectId,
            imageUrl: image.imageUrl,
            caption: image.caption,
            stage: image.stage,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'artist',
          };
          return { ...p, progressImages: [...p.progressImages, newImage] };
        })
      );
    },
    []
  );

  const acceptPreview = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status: 'final_accepted' as ProjectStatus,
                milestones: p.milestones.map((m, i) =>
                  i === 4 ? { ...m, status: 'done' as const } : m
                ),
              }
            : p
        )
      );
    },
    []
  );

  const requestRevision = useCallback(
    (projectId: string, note: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const msg: ProjectMessage = {
            id: `msg-${Date.now()}`,
            projectId,
            senderId: p.clientId,
            senderName: p.clientName,
            senderRole: 'client',
            body: `Poproszę o poprawki: ${note}`,
            createdAt: new Date().toISOString(),
          };
          return {
            ...p,
            status: 'revision_requested' as ProjectStatus,
            messages: [...p.messages, msg],
          };
        })
      );
    },
    []
  );

  const payFinal = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                finalPaid: true,
                status: 'fully_paid' as ProjectStatus,
                payments: p.payments.map((pay) =>
                  pay.type === 'final' ? { ...pay, status: 'paid' as const, paidAt: new Date().toISOString() } : pay
                ),
                milestones: p.milestones.map((m, i) =>
                  i === 4 ? { ...m, status: 'done' as const } :
                  i === 5 ? { ...m, status: 'in_progress' as const } : m
                ),
              }
            : p
        )
      );
    },
    []
  );

  const markDelivered = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status: 'delivered' as ProjectStatus,
                milestones: p.milestones.map((m, i) =>
                  i === 5 ? { ...m, status: 'done' as const } : m
                ),
              }
            : p
        )
      );
    },
    []
  );

  const completeProject = useCallback(
    (projectId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status: 'completed' as ProjectStatus,
                completedAt: new Date().toISOString(),
                milestones: p.milestones.map((m) => ({ ...m, status: 'done' as const })),
              }
            : p
        )
      );
    },
    []
  );

  const cancelProject = useCallback(
    (projectId: string) => {
      updateProjectStatus(projectId, 'cancelled');
    },
    [updateProjectStatus]
  );

  const disputeProject = useCallback(
    (projectId: string, reason: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const msg: ProjectMessage = {
            id: `msg-${Date.now()}`,
            projectId,
            senderId: p.clientId,
            senderName: p.clientName,
            senderRole: 'client',
            body: `Otwarto spór: ${reason}`,
            createdAt: new Date().toISOString(),
          };
          return {
            ...p,
            status: 'disputed' as ProjectStatus,
            messages: [...p.messages, msg],
          };
        })
      );
    },
    []
  );

  const addMessage = useCallback(
    (projectId: string, senderId: string, senderName: string, senderRole: 'artist' | 'client', body: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const msg: ProjectMessage = {
            id: `msg-${Date.now()}`,
            projectId,
            senderId,
            senderName,
            senderRole,
            body,
            createdAt: new Date().toISOString(),
          };
          return { ...p, messages: [...p.messages, msg] };
        })
      );
    },
    []
  );

  return {
    projects,
    getProject,
    payDeposit,
    markConceptReady,
    startPainting,
    uploadPreview,
    addProgressImage,
    acceptPreview,
    requestRevision,
    payFinal,
    markDelivered,
    completeProject,
    cancelProject,
    disputeProject,
    addMessage,
    updateProjectStatus,
  };
}
