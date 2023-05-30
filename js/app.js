class CalorieTracker {
    constructor() {
        this._caloriesLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

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
        this._dispayNewMeal(meal);
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._render();
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

    _dispayNewMeal(meal) {
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
        mealItems.appendChild(div);
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
        workoutItems.appendChild(div);
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

// const tracker = new CalorieTracker();

// const breakfast = new Meal('Breakfast', 400);
// const lunch = new Meal('Lunch', 350)
// tracker.addMeal(breakfast);
//  tracker.addMeal(lunch)

// const run = new Workout('Morning run', 320);
// // const pushUps = new Workout('Pushups', 10000);
// tracker.addWorkout(run);
// // tracker.addWorkout(pushUps);

// console.log(tracker._meals);
// console.log(tracker._workouts);
// console.log(tracker._totalCalories);

class App {
    constructor() {
        this.tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this,'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
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
}

const app = new App();