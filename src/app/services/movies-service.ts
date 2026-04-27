import { TmdbService } from './tmdb-service';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private api = inject(TmdbService);

  movies = signal<Movie[]>([]);

  isLoading = signal(false);
  error = signal<string | null>(null);

  searchTerm = signal<string>('');
  sortBy = signal<'date' | 'name' | 'amount'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');


  filteredBudgets = computed(() => {
    let moviesList = [...this.movies()];
    const term = this.searchTerm().toLowerCase();

    if (term) {
      moviesList = moviesList.filter((movie) => movie.title.toLowerCase().includes(term));
    }

    // return moviesList.sort((a, b) => {
    //   const order = this.sortOrder() === 'desc' ? -1 : 1;

    //   if (this.sortBy() === 'genre') {
    //     return (a..getTime() - b.date.getTime()) * order;
    //   }
    //   if (this.sortBy() === 'amount') {
    //     return (a.total - b.total) * order;
    //   }
    //   return a.clientName.localeCompare(b.clientName) * order;
    // });
//   });

//   constructor() {
//     this.fetchBudgets();
//   }

//   async fetchBudgets() {
//     this.isLoading.set(true);
//     this.error.set(null);

//     try {
//       const { data, error } = await this.api.getBudgets();
//       if (error) throw error;

//       const mapped = (data || []).map(BudgetMapper.fromRemote);
//       this.budgetHistory.set(mapped);
//     } catch (err: any) {
//       this.error.set(`Error carregant historial: ${err.message}`);
//     } finally {
//       this.isLoading.set(false);
//     }
//   }

//   async addBudget(newBudget: Budget) {
//     this.isLoading.set(true);
//     try {
//       const remoteData = BudgetMapper.toRemote(newBudget);
//       const { error } = await this.api.saveBudget(remoteData);
//       if (error) throw error;
//       await this.fetchBudgets();
//     } catch (err: any) {
//       this.error.set(`Error en guardar: ${err.message}`);
//       throw err;
//     } finally {
//       this.isLoading.set(false);
//     }
//   }

//   async deleteBudget(id: number) {
//     this.isLoading.set(true);

//     try {
//       const { error } = await this.api.deleteBudget(id);
//       if (error) throw error;

//       this.budgetHistory.update((budgets) => budgets.filter((b) => b.id !== id));
//     } catch (err: any) {
//       this.error.set(`Error en esborrar: ${err.message}`);
//     } finally {
//       this.isLoading.set(false);
//     }
//   }

//   updateServiceSelection(id: string) {
//     this.services.update((prevServices) =>
//       prevServices.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s)),
//     );
//   }

//   resetFilters() {
//     this.searchTerm.set('');
//     this.sortBy.set('date');
//     this.sortOrder.set('desc');
//   }
// }
  })};
