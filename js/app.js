class CalorieTracker {
    constructor() {
        this._caloriesLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this.showMealsAndWorkouts();
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeals(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkouts(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    setLimit(limit) {
        this._caloriesLimit = limit;
        Storage.setCalorieLimit(limit);
        this._displayCaloriesLimit();
        this._render();
    }

    showMealsAndWorkouts() {
        this._meals.forEach(meal => {
            this._displayNewMeal(meal);
        })

        this._workouts.forEach(workout => {
            this._displayNewWorkout(workout);
        })
    }

    _displayCaloriesTotal(){
        document.getElementById('calories-total').textContent = this._totalCalories
    }

    _displayCaloriesLimit() {
        document.getElementById('calories-limit').textContent = this._caloriesLimit
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => {
            return total + meal.calories
        }, 0)

        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => {
            return total + workout.calories
        }, 0)

        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const remaining = this._caloriesLimit - this._totalCalories;

        const caloriesRemainingEl = document.getElementById('calories-remaining');
        caloriesRemainingEl.textContent = remaining

        if (remaining < 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
        }else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
        }
    }
    
    _displayCaloriesProgress() {
        const caloriesProgressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._caloriesLimit ) * 100;

        const width = Math.min(percentage, 100) <= 0 ? 0 : Math.min(percentage, 100);

        caloriesProgressEl.style.width = `${width}%`;

        if (width === 100) {
            caloriesProgressEl.classList.add('bg-danger')
        }else {
            caloriesProgressEl.classList.remove('bg-danger')
        }
    }

    _displayNewMeal(meal) {
        const mealItems = document.getElementById('meal-items');
        const div = document.createElement('div');
        div.className = 'card my-2';
        div.innerHTML = `
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <h4 class="mx-1">${meal.name}</h4>
                        <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                        >
                            ${meal.calories}
                        </div>
                        <button class="delete btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>`
        div.addEventListener('click', this._deleteMeal.bind(this,div,meal));
        mealItems.appendChild(div);
    }

    _deleteMeal(div,meal,e) {
        if(e.target.tagName === 'BUTTON' || e.target.tagName === 'I'){
            div.remove();
            this._totalCalories -= meal.calories;
            this._meals = this._meals.filter(el => el !== meal);
            Storage.updateTotalCalories(this._totalCalories);
            Storage.deleteMeal(meal);
        }
        this._render();
    }

    _displayNewWorkout(workout) {
        const workoutItems = document.getElementById('workout-items');
        const div = document.createElement('div');
        div.className = 'card my-2';
        div.innerHTML = `
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <h4 class="mx-1">${workout.name}</h4>
                        <div
                        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                        >
                            ${workout.calories}
                        </div>
                        <button class="delete btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>`
        div.addEventListener('click', this._deleteWorkout.bind(this,div,workout));
        workoutItems.appendChild(div);
    }

    _deleteWorkout(div,workout,e) {
        if(e.target.tagName === 'BUTTON' || e.target.tagName === 'I'){
            div.remove();
            this._totalCalories += workout.calories;
            this._workouts = this._workouts.filter(el => el !== workout)
            Storage.updateTotalCalories(this._totalCalories);
            Storage.deleteWorkout(workout);
        }
        this._render();
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress(); 
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Storage{
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit')
        }

        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit)
    }

    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        }else {
            totalCalories = +localStorage.getItem('totalCalories')
        }

        return totalCalories;
    }

    static updateTotalCalories(totalCalories) {
        localStorage.setItem('totalCalories', totalCalories)
    }

    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') === null){
            meals = []
        }else {
            meals = JSON.parse(localStorage.getItem('meals'))
        }
        return meals;
    }

    static saveMeals(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null){
            workouts = []
        }else {
            workouts = JSON.parse(localStorage.getItem('workouts'))
        }
        return workouts;
    }

    static saveWorkouts(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static deleteMeal(deleteMeal){
        let meals = JSON.parse(localStorage.getItem('meals'));
        
        meals = meals.filter(meal => {
            return meal.id !== deleteMeal.id
        })

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static deleteWorkout(deleteWorkout){
        let workouts = JSON.parse(localStorage.getItem('workouts'));
        
        workouts = workouts.filter(workout => {
            return workout.id !== deleteWorkout.id
        })

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

}

class App {
    constructor() {
        this.tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this,'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('input', this._filterMeals.bind(this));
        document.getElementById('filter-workouts').addEventListener('input', this._filterWorkouts.bind(this));
        document.getElementById('reset').addEventListener('click', this._resetDay.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem (type, e) {
        e.preventDefault();
        let name = document.getElementById(`${type}-name`).value;
        let calories = document.getElementById(`${type}-calories`).value;

        if(name === '' || calories === ''){
            alert("Please fill meal form");
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name, parseInt(calories));
            this.tracker.addMeal(meal);
        } else {
            const workout = new Workout(name, parseInt(calories));
            this.tracker.addWorkout(workout);
        }

        name = '';
        calories = '';

        const formMenu = document.getElementById(`collapse-${type}`);
        formMenu.classList.remove('show');
        formMenu.classList.remove('collapse');

        formMenu.classList.add('collapse');
    }

    _filterMeals(e){
        const meals = document.querySelectorAll('#meal-items .card');
        meals.forEach(el => {
            if (el.firstElementChild.firstElementChild.firstElementChild
                .textContent.toLowerCase().includes(e.target.value)){
                    el.style.display = 'flex';
            }else{
                el.style.display = 'none';
            }
        })
    }

    _filterWorkouts(e){
        const workouts = document.querySelectorAll('#workout-items .card');
        workouts.forEach(el => {
            if (el.firstElementChild.firstElementChild.firstElementChild
                .textContent.toLowerCase().includes(e.target.value)){
                    el.style.display = 'flex';
            }else{
                el.style.display = 'none';
            }
        })
    }

    _resetDay(e) {
        localStorage.clear();
        delete this.tracker;
        this.tracker = new CalorieTracker();
        const meals = document.querySelectorAll('.my-2');
        meals.forEach(el => {
            el.remove();
        })
    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.getElementById('limit');
        if (limit.value === '') {
            alert('Please add a limit')
            return;
        }

        this.tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal')
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide;
    }
}

const app = new App();
