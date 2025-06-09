library(pls)

#for whole wavelength 950-1650

data_msc <- read.table("data_msc.txt", header = TRUE)


NIR2 <- data_msc [,2:377]
NIR2 <- as.matrix (NIR2)

Cper2 <- data_msc [,1]

data_msc_New <- data.frame(Cper2, NIR2=I(NIR2))

E2 <- plsr(Cper2 ~ NIR2, ncomp = 10, data = data_msc_New, validation = "LOO")

summary(E2)

plot(RMSEP(E2), legendpos = "topright")

plot(E2, ncomp = 4, asp = 1, line = TRUE)

plot(E2, plottype = "scores", comps = 1:4)

R2(E2,ncomp=4)





T1Test_msc <- data_msc_New[1:20,]

T1Train_msc <- data_msc_New[21:96,]

E2_2 <- plsr(Cper2 ~ NIR2, ncomp = 10, data = T1Train_msc, validation = "LOO")

predict(E2_2, ncomp = 2, newdata = T1Test_msc)


# Predict with the trained model on the test set
predicted <- predict(E2_2, ncomp = 2, newdata = T1Test_msc)

# Extract the actual values
actual <- T1Test_msc$Cper2

# Compute RMSE
rmse <- sqrt(mean((predicted - actual)^2))

# Print RMSE with wavelength info
cat("RMSE for wavelength range 950-1650 nm:", round(rmse, 4), "\n")


############################################################################################


#for 1100-1650 nm 


data_msc <- read.table("data_msc.txt", header = TRUE)


NIR2d <- data_msc [,102:377]
NIR2d <- as.matrix (NIR2d)

Cper2d <- data_msc [,1]

data_msc_Newd <- data.frame(Cper2d, NIR2d=I(NIR2d))

E2d <- plsr(Cper2d ~ NIR2d, ncomp = 10, data = data_msc_Newd, validation = "LOO")

summary(E2d)

plot(RMSEP(E2d), legendpos = "topright")

plot(E2d, ncomp = 4, asp = 1, line = TRUE)

plot(E2d, plottype = "scores", comps = 1:4)

R2(E2d,ncomp=4)



T1Test_mscd <- data_msc_Newd[1:20,]

T1Train_mscd <- data_msc_Newd[21:96,]

E2_2d <- plsr(Cper2d ~ NIR2d, ncomp = 10, data = T1Train_mscd, validation = "LOO")

predict(E2_2d, ncomp = 2, newdata = T1Test_mscd)


# Predict with the trained model on the test set
predicted <- predict(E2_2d, ncomp = 2, newdata = T1Test_mscd)

# Extract the actual values
actual <- T1Test_mscd$Cper2d

# Compute RMSE
rmse <- sqrt(mean((predicted - actual)^2))

# Print RMSE with wavelength info
cat("RMSE for wavelength range 1100-1650 nm:", round(rmse, 4), "\n")




#########################################################################################



#for 1200-1650 nm 


data_msc <- read.table("data_msc.txt", header = TRUE)


NIR2c <- data_msc [,152:377]
NIR2c <- as.matrix (NIR2c)

Cper2c <- data_msc [,1]

data_msc_Newc <- data.frame(Cper2c, NIR2c=I(NIR2c))

E2c <- plsr(Cper2c ~ NIR2c, ncomp = 10, data = data_msc_Newc, validation = "LOO")

summary(E2c)

plot(RMSEP(E2c), legendpos = "topright")

plot(E2c, ncomp = 4, asp = 1, line = TRUE)

plot(E2c, plottype = "scores", comps = 1:4)

R2(E2c,ncomp=4)



T1Test_mscc <- data_msc_Newc[1:20,]

T1Train_mscc <- data_msc_Newc[21:96,]

E2_2c <- plsr(Cper2c ~ NIR2c, ncomp = 10, data = T1Train_mscc, validation = "LOO")

predict(E2_2c, ncomp = 2, newdata = T1Test_mscc)




###################################################################################

#for 1300-1650 nm 


data_msc <- read.table("data_msc.txt", header = TRUE)


NIR2b <- data_msc [,202:377]
NIR2b <- as.matrix (NIR2b)

Cper2b <- data_msc [,1]

data_msc_Newb <- data.frame(Cper2b, NIR2b=I(NIR2b))

E2b <- plsr(Cper2b ~ NIR2b, ncomp = 10, data = data_msc_Newb, validation = "LOO")

summary(E2b)

plot(RMSEP(E2b), legendpos = "topright")

plot(E2b, ncomp = 4, asp = 1, line = TRUE)

plot(E2b, plottype = "scores", comps = 1:4)

R2(E2b,ncomp=4)





T1Test_mscb <- data_msc_Newb[1:20,]

T1Train_mscb <- data_msc_Newb[21:96,]

E2_2b <- plsr(Cper2b ~ NIR2b, ncomp = 10, data = T1Train_mscb, validation = "LOO")

predict(E2_2b, ncomp = 2, newdata = T1Test_mscb)


###################################################################################

#SG1 

#for whole wavelength 950-1650

data_sg1 <- read.table("data_sg1.txt", header = TRUE)


NIR4 <- data_sg1 [,2:377]
NIR4 <- as.matrix (NIR4)

Cper4 <- data_sg1 [,1]

data_sg1_New <- data.frame(Cper4, NIR4=I(NIR4))

E4 <- plsr(Cper4 ~ NIR4, ncomp = 10, data = data_sg1_New, validation = "LOO")

summary(E4)

plot(RMSEP(E4), legendpos = "topright")

plot(E4, ncomp = 4, asp = 1, line = TRUE)

plot(E4, plottype = "scores", comps = 1:4)

R2(E4,ncomp=4)





T1Test_sg1 <- data_sg1_New[1:20,]

T1Train_sg1 <- data_sg1_New[21:96,]

E4_2 <- plsr(Cper4 ~ NIR4, ncomp = 10, data = T1Train_sg1, validation = "LOO")

predict(E4_2, ncomp = 1, newdata = T1Test_sg1)


#####################################################################################

#1300-1650 nm


data_sg1 <- read.table("data_sg1.txt", header = TRUE)


NIR4b <- data_sg1 [,202:377]
NIR4b <- as.matrix (NIR4b)

Cper4b <- data_sg1 [,1]

data_sg1_Newb <- data.frame(Cper4b, NIR4b=I(NIR4b))

E4b <- plsr(Cper4b ~ NIR4b, ncomp = 10, data = data_sg1_Newb, validation = "LOO")

summary(E4b)

plot(RMSEP(E4b), legendpos = "topright")

plot(E4b, ncomp = 4, asp = 1, line = TRUE)

plot(E4b, plottype = "scores", comps = 1:4)

R2(E4b,ncomp=4)





T1Test_sg1b <- data_sg1_Newb[1:20,]

T1Train_sg1b <- data_sg1_Newb[21:96,]

E4_2b <- plsr(Cper4b ~ NIR4b, ncomp = 10, data = T1Train_sg1b, validation = "LOO")

predict(E4_2b, ncomp = 2, newdata = T1Test_sg1b)



#############################################################################

#SNV

#for whole wavelength 950-1650

data_snv <- read.table("data_snv.txt", header = TRUE)


NIR3 <- data_snv [,2:377]
NIR3 <- as.matrix (NIR3)

Cper3 <- data_snv [,1]

data_snv_New <- data.frame(Cper3, NIR3=I(NIR3))

E3 <- plsr(Cper3 ~ NIR3, ncomp = 10, data = data_snv_New, validation = "LOO")

summary(E3)

plot(RMSEP(E3), legendpos = "topright")

plot(E3, ncomp = 4, asp = 1, line = TRUE)

plot(E3, plottype = "scores", comps = 1:4)

R2(E3,ncomp=4)





T1Test_snv <- data_snv_New[1:20,]

T1Train_snv <- data_snv_New[21:96,]

E3_2 <- plsr(Cper3 ~ NIR3, ncomp = 10, data = T1Train_snv, validation = "LOO")

predict(E3_2, ncomp = 2, newdata = T1Test_snv)



####################################################################################


#SNV

#for whole wavelength 1300-1650

data_snv <- read.table("data_snv.txt", header = TRUE)


NIR3b <- data_snv [,202:377]
NIR3b <- as.matrix (NIR3b)

Cper3b <- data_snv [,1]

data_snv_Newb <- data.frame(Cper3b, NIR3b=I(NIR3b))

E3b <- plsr(Cper3b ~ NIR3b, ncomp = 10, data = data_snv_Newb, validation = "LOO")

summary(E3b)

plot(RMSEP(E3b), legendpos = "topright")

plot(E3b, ncomp = 4, asp = 1, line = TRUE)

plot(E3b, plottype = "scores", comps = 1:4)

R2(E3b,ncomp=4)





T1Test_snvb <- data_snv_Newb[1:20,]

T1Train_snvb <- data_snv_Newb[21:96,]

E3_2b <- plsr(Cper3b ~ NIR3b, ncomp = 10, data = T1Train_snvb, validation = "LOO")

predict(E3_2b, ncomp = 2, newdata = T1Test_snvb)

