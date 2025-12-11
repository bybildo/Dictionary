export class StudyLevelService {
    #lesson;
    #tasks = [];

    constructor(lesson) {
        this.#lesson = lesson;
    }

    getTasks() {
        return this.#tasks;
    }

    getLesson() {
        return this.#lesson;
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    applyTasks() {
        if (this.#lesson.type === 'local') {
            for (const task of this.#tasks) {
                const [index, pointsStr] = task.split(' ');
                const points = Number(pointsStr);
                const targetCards = [this.#lesson.cards[Number(index)]].filter(Boolean);

                targetCards.forEach(card => {
                    card.studyLevel = Math.max(0, Math.min(card.studyLevel + points, 100));
                });
            }

            localStorage.setItem(this.#lesson.id, JSON.stringify(this.#lesson));
            this.#tasks = [];
        }
    }
}