import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import content from '../content/portfolio.json';

async function load(path) {
  const { data } = await api.get(path);
  return data.data;
}

function useLive(key, path, fallback) {
  const query = useQuery({
    queryKey: [key],
    queryFn: () => load(path),
    retry: 1,
    staleTime: 30_000,
  });
  return { ...query, content: query.isSuccess ? query.data : fallback };
}

export function useProfile() {
  return useLive('profile', '/profile', content.profile);
}

export function useSkills() {
  return useLive('skills', '/skills', content.skills);
}

export function useProjects() {
  return useLive('projects', '/projects', content.projects);
}

export function useExperience() {
  return useLive('experience', '/experience', content.experience);
}

export function projectBySlug(projects, slug) {
  return projects.find((project) => project.slug === slug) || null;
}
