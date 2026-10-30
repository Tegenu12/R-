export interface RTrainingLesson {
  id: string;
  module: string;
  title: string;
  author: string;
  scriptSource: 'Rcode_Y.R' | 'Tegenu.R';
  rCode: string;
  explanation: string;
  datasetId: string;
  targetView: 'descriptive' | 'graphics' | 'inferential' | 'anova' | 'regression' | 'timeseries';
}

export const TRAINING_LESSONS: RTrainingLesson[] = [
  {
    id: 'lesson-1-freq',
    module: 'Module 1: Descriptive Analysis',
    title: 'Frequency Distribution & Categorical Tables',
    author: 'Yeshiwork A. (MSc.)',
    scriptSource: 'Rcode_Y.R',
    rCode: `# Example raw data simulation based on given frequencies
raw_data <- c(rep("Male", 182), rep("Female", 235), rep("Other", 27))
freq_table <- table(raw_data)
freq_df <- as.data.frame(freq_table)
names(freq_df) <- c("Gender", "Frequency")
total <- sum(freq_df$Frequency)
freq_df$Percentage <- round((freq_df$Frequency / total) * 100, 2)
print(freq_df)`,
    explanation: 'Demonstrates tabulating categorical data with table(), calculating percentage distribution, and formatting into clean data frames for research publications.',
    datasetId: 'stat_score',
    targetView: 'descriptive'
  },
  {
    id: 'lesson-2-grouped-freq',
    module: 'Module 1: Descriptive Analysis',
    title: 'Grouped Frequency Distribution Table',
    author: 'Yeshiwork A. (MSc.)',
    scriptSource: 'Rcode_Y.R',
    rCode: `# Intervals and corresponding frequencies
intervals <- c("0-4", "5-8", "9-12", "13-16", "17+")
frequencies <- c(6, 20, 42, 24, 8)
percentages <- c(6, 20, 42, 24, 8)
grouped_table <- data.frame(
  "Library visits in the past year" = intervals,
  Frequency = frequencies,
  Percent = paste0(percentages, "%")
)
print(grouped_table)`,
    explanation: 'Constructs continuous data interval bins, tallying frequencies and relative proportions across groups.',
    datasetId: 'stat_score',
    targetView: 'descriptive'
  },
  {
    id: 'lesson-3-central-tendency',
    module: 'Module 1: Descriptive Analysis',
    title: 'Measures of Central Tendency & Dispersion',
    author: 'Yeshiwork A. (MSc.)',
    scriptSource: 'Rcode_Y.R',
    rCode: `library_visits <- c(15, 3, 12, 0, 24, 3)
mean(library_visits)
median(library_visits)
freq_table <- table(library_visits)
mode_value <- as.numeric(names(freq_table)[freq_table == max(freq_table)])

# Measures of variability
data_range <- max(library_visits) - min(library_visits)
var(library_visits)
sd(library_visits)
IQR(library_visits)`,
    explanation: 'Computes arithmetic mean, median (sorted middle values), empirical mode, sample variance (s²), standard deviation, and interquartile range (IQR).',
    datasetId: 'stat_score',
    targetView: 'descriptive'
  },
  {
    id: 'lesson-4-graphics-bars',
    module: 'Module 2: Statistical Graphics',
    title: 'Bar Plots, Stacked & Grouped Visualizations',
    author: 'Yeshiwork A. (MSc.)',
    scriptSource: 'Rcode_Y.R',
    rCode: `counts <- table(Arthritis$Improved, Arthritis$Treatment)
# Stacked Bar Plot
barplot(counts, main="Stacked Bar Plot", xlab="Treatment",
        ylab="Frequency", col=c("red", "yellow", "green"), legend=rownames(counts))

# Grouped Bar Plot (beside = TRUE)
barplot(counts, main="Grouped Bar Plot", xlab="Treatment",
        ylab="Frequency", col=c("red", "yellow", "green"), legend=rownames(counts), beside=TRUE)`,
    explanation: 'Visualizes cross-tabulations and bivariate categorical frequencies using stacked and side-by-side grouped bar charts.',
    datasetId: 'mtcars',
    targetView: 'graphics'
  },
  {
    id: 'lesson-5-histograms',
    module: 'Module 2: Statistical Graphics',
    title: 'Histograms, Density Curves & Normal Fit',
    author: 'Yeshiwork A. (MSc.)',
    scriptSource: 'Rcode_Y.R',
    rCode: `x <- mtcars$mpg
h <- hist(x, breaks=12, col="red", xlab="Miles Per Gallon", main="Histogram with normal curve")
xfit <- seq(min(x), max(x), length=40)
yfit <- dnorm(xfit, mean=mean(x), sd=sd(x))
yfit <- yfit * diff(h$mids[1:2]) * length(x)
lines(xfit, yfit, col="blue", lwd=2)`,
    explanation: 'Plots distribution histograms overlaid with Gaussian theoretical normal density curves and kernel density estimates.',
    datasetId: 'mtcars',
    targetView: 'graphics'
  },
  {
    id: 'lesson-6-ttest',
    module: 'Module 3: Hypothesis Testing',
    title: 'Independent & Paired Samples t-Tests',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `# Two sample Parametric model
# Independent sample t test:
t.test(cars$dist, cars$speed) # H1: true difference in means != 0

# Paired sample t test (before vs after therapy):
library(MASS)
t.test(anorexia$Prewt, anorexia$Postwt, paired=TRUE, alternative='two')`,
    explanation: 'Tests whether population mean difference equals zero using Student’s t-statistic for independent groups (Welch formula) or paired observations.',
    datasetId: 'anorexia',
    targetView: 'inferential'
  },
  {
    id: 'lesson-7-nonparam',
    module: 'Module 3: Hypothesis Testing',
    title: 'Non-Parametric Wilcoxon & Ansari-Bradley Tests',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `# Two-sample Wilcoxon rank-sum test (Mann-Whitney)
wilcox.test(cars$dist, cars$speed, conf.int=TRUE)

# Matched-pairs Wilcoxon signed-rank test
wilcox.test(anorexia$Prewt, anorexia$Postwt, conf.int=TRUE, paired=TRUE)

# Variance comparison F-test
var.test(cars$dist, cars$speed) # H1: ratio of variances != 1`,
    explanation: 'Distribution-free tests based on ranks for non-normal continuous data and variance comparison F-tests.',
    datasetId: 'cars',
    targetView: 'inferential'
  },
  {
    id: 'lesson-8-anova',
    module: 'Module 4: Analysis of Variance (ANOVA)',
    title: 'One-Way ANOVA & LSD Post-Hoc Tests',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `# One-way ANOVA
Anova.Spray <- aov(sqrt(count) ~ spray, data=InsectSprays)
summary(Anova.Spray)

# Fisher's Least Significant Difference (LSD) Post-Hoc
library(agricolae)
g <- LSD.test(Anova.Spray, "spray", p.adj="none")
summary(g)

# Bartlett test for homogeneity of variances
bartlett.test(sqrt(count) ~ spray, data=InsectSprays)`,
    explanation: 'Partitioning sum of squares between and within experimental treatments, followed by post-hoc pairwise mean separation.',
    datasetId: 'InsectSprays',
    targetView: 'anova'
  },
  {
    id: 'lesson-9-regression',
    module: 'Module 5: Regression & Model Diagnostics',
    title: 'Linear & Quadratic Regression with Residual Diagnostics',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `# Simple Linear Regression
sl <- lm(cars$speed ~ cars$dist)
summary(sl)

# Diagnostics
plot(cars$dist, cars$speed, xlab="distance", ylab="speed")
abline(sl, lty=2)
qqnorm(resid(sl))
qqline(resid(sl), lty=2)
shapiro.test(resid(sl))

# Quadratic polynomial comparison
Qm <- lm(cars$speed ~ cars$dist + I(cars$dist^2))
anova(sl, Qm) # H1: significant model improvement`,
    explanation: 'Fits linear and polynomial equations, checks homoscedasticity and normality assumptions via residual Q-Q plots, and compares nested models via ANOVA.',
    datasetId: 'cars',
    targetView: 'regression'
  },
  {
    id: 'lesson-10-logistic',
    module: 'Module 5: Regression & Model Diagnostics',
    title: 'Binary Logistic Regression & Odds Ratios',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `# Logistic regression for binary outcome
fit.full <- glm(mtcars$am ~ mtcars$vs + mtcars$mpg + mtcars$cyl, data=mtcars, family="binomial")
summary(fit.full)

# Hosmer-Lemeshow goodness-of-fit test
library(generalhoslem)
logitgof(mtcars$am, fitted(fit.full))`,
    explanation: 'Models binary probabilities using log-odds link functions, computing Odds Ratios (OR = exp(beta)) and calibration fit.',
    datasetId: 'mtcars',
    targetView: 'regression'
  },
  {
    id: 'lesson-11-timeseries',
    module: 'Module 6: Time Series Analysis',
    title: 'Decomposition, ACF/PACF & ARIMA Forecasting',
    author: 'Tegenu',
    scriptSource: 'Tegenu.R',
    rCode: `tsdata <- ts(AirPassengers, freq=12)
ddata <- decompose(tsdata, "multiplicative")
plot(ddata)

# Stationarity & Trend tests
adf.test(AirPassengers)
trend_test <- MannKendall(AirPassengers)

# Autocorrelation & Model
acf(AirPassengers)
pacf(AirPassengers)
mymodel <- auto.arima(AirPassengers)
myforecast <- forecast(mymodel, level=c(95), h=12)
plot(myforecast)`,
    explanation: 'Decomposes time series into trend, seasonal, and random components; assesses stationarity via ADF; and generates ARIMA forecasts with 95% confidence intervals.',
    datasetId: 'AirPassengers',
    targetView: 'timeseries'
  }
];
