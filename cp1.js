var app = angular.module('app', ['ui.bootstrap']);

app.controller("mainController", ["$scope", function($scope) {
    var maxMarkovNumber = 20;
    var maxNumCharToGenerate = 10000;
    $scope.source = "";
    $scope.generateTextClicked = false;
    $scope.generatedText = undefined;
    $scope.markovNumber = 10;
    $scope.markovNumbers = [];
    for (var i = 1; i <= maxMarkovNumber; i++) {
        $scope.markovNumbers.push(i);
    }

    $scope.saveMarkovNumber = function(num) {
        $scope.markovNumber = num;
    };

    $scope.checkForErrorSource = function() {
        return $scope.markovNumber >= $scope.source.length && $scope.generateTextClicked;
    };

    $scope.checkForErrorNumChar = function() {
        return $scope.generateTextClicked === true && (!isInt($scope.numCharToGenerate) || $scope.numCharToGenerate >= maxNumCharToGenerate);
    };

    $scope.generateText = function() {
        $scope.generateTextClicked = true;
        if ($scope.checkForErrorSource() || $scope.checkForErrorNumChar()) {
            $scope.generatedText = "";
            return;
        }

        var markovNumber = $scope.markovNumber;
        var source = $scope.source;

        model = {};
        buildModelRecursively(source, model, markovNumber);

        $scope.generatedText = generateSentences(model, markovNumber, $scope.numCharToGenerate);
    };

    function buildModelRecursively(source, model, markovNumber) {
        if (markovNumber === 0) {
            return;
        }

        var currentSeed = "";
        sourceTextIndex = 0;
        for (var i = 0; i < markovNumber; i++) {
            currentSeed += source[sourceTextIndex];
            sourceTextIndex++;
        }

        while (sourceTextIndex < source.length) {
            var nextChar = source[sourceTextIndex++];
            if (!(currentSeed in model)) {
                model[currentSeed] = [];

            }

            model[currentSeed].push(nextChar);

            currentSeed = currentSeed.substring(1);
            currentSeed = currentSeed + nextChar;
        }

        buildModelRecursively(source, model, markovNumber - 1);
    }

    function getMostOccuringString(model, markovNumber) {
        var mostOccuringString, count;
        for (var key in model) {
            if (key.length < markovNumber || key === " ") {
                continue;
            }

            var numOccurences = model[key].length;
            if (numOccurences > count || mostOccuringString === undefined) {
                mostOccuringString = key;
                count = numOccurences;
            }
        }

        return mostOccuringString;
    }

    function generateSentences(model, markovNumber, numCharToGenerate) {
        var initialSeed = getMostOccuringString(model, markovNumber);
        var curSeed = initialSeed;

        var randomText = "";

        while (randomText.length < numCharToGenerate) {
            var nextChar = getNextChar(model, curSeed);

            if (nextChar === undefined) {
                nextChar = getRandomChar();
            }
            randomText += nextChar;

            curSeed = curSeed.slice(1);
            curSeed += nextChar;
        }

        return randomText;
    }

    function getNextChar(model, curSeed) {
        if (curSeed === "") {
            return undefined;
        } else if (!(curSeed in model)) {
            return getNextChar(model, curSeed.slice(1));
        }

        var randomIndex = getRandomInt(0, model[curSeed].length);
        return model[curSeed][randomIndex];
    }

    function isInt(n) {
        return !isNaN(n) && parseInt(Number(n)) == n && !isNaN(parseInt(n, 10));
    }

    function getRandomChar() {
        var randomInt = getRandomInt(0, 26);

        return String.fromCharCode(97 + randomInt);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}]);
