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
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
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

        const width = Math.min(percentage, 100);
        caloriesProgressEl.style.width = `${width}%`;

        if (width === 100) {
            caloriesProgressEl.classList.add('bg-danger')
        }else {
            caloriesProgressEl.classList.remove('bg-danger')
        }
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
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));
        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
    }

    _newMeal (e) {
        e.preventDefault();
        let mealName = document.getElementById('meal-name').value;
        let mealCalories = document.getElementById('meal-calories').value;

        if(mealName === '' || mealCalories === ''){
            alert("Please fill meal form");
            return;
        }

        const meal = new Meal(mealName, parseInt(mealCalories));
        this.tracker.addMeal(meal);

        mealName = '';
        mealCalories = '';

        const formMenu = document.getElementById('collapse-meal');
        formMenu.classList.remove('show');
        formMenu.classList.remove('collapse');

        formMenu.classList.add('collapse');
    }

    _newWorkout (e) {
        e.preventDefault();
        let workoutName = document.getElementById('workout-name').value;
        let workoutCalories = document.getElementById('workout-calories').value;

        if(workoutName === '' || workoutCalories === ''){
            alert("Please fill workout form");
            return;
        }

        const workout = new Workout(workoutName, parseInt(workoutCalories));
        this.tracker.addWorkout(workout);

        workoutName = '';
        workoutCalories = '';

        const formMenu = document.getElementById('collapse-workout');
        formMenu.classList.remove('show');
        formMenu.classList.remove('collapse');

        formMenu.classList.add('collapse');
    }
}

const app = new App();