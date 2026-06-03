###################################Pre-settings###################################
#-----------------------------Packages Installation-------------------------------
rm(list=ls())
ns_p<-c("magrittr","dplyr","tidyr","reshape2")
INST<-function(pkg){new.pkg <- pkg[!(pkg %in% installed.packages()[, "Package"])]
if(length(new.pkg)){install.packages(new.pkg, dependencies = TRUE)}
sapply(pkg, require, character.only = TRUE)};INST(ns_p);options(warn=1)
#-----------------------------Main Function-------------------------------
Mct <- function(year,data){Mct <- data[,c("ISO","WIPO",paste0("X",year))] %>%
    pivot_wider(names_from = WIPO,values_from = paste0("X",year))
  rnames <- unlist(Mct[,1])
  Mct <- apply(Mct[,-1],2,function(x) as.numeric(as.character(x)))
  T_t <- colSums(Mct);C_t <- rowSums(Mct);W_t <- sum(T_t)
  for(c in 1:nrow(Mct)){for(t in 1:ncol(Mct)){if(C_t[c] != 0 & T_t[t] != 0){
    Mct[c,t] <- (Mct[c,t]/C_t[c])/(T_t[t]/W_t)}else{
      Mct[c,t] <- 0}}};rownames(Mct) <- rnames;Mct}
GPY <- function(year,data){Mct <- data.frame(Mct(year,data))
  cnames<-rownames(Mct);tnames<-colnames(Mct)
  sc <- rowSums(Mct);st <- colSums(Mct);stt <-numeric(tl)
  for(t in 1:tl){stt[t] <- sum(Mct[,t]/sc,na.rm = TRUE)}
  Wct <- Mct/sc%*%t(stt);for(t in tl){Wct[which(is.nan(Wct[,t])),] <- 0}
  N <- as.matrix(Wct) %*% t(as.matrix(Wct));for(c in 1:cl){N[c,c] <- 0}
  G <- t(as.matrix(Wct)) %*% as.matrix(Wct);for(t in 1:tl){G[t,t] <- 0}
  NL1 <- eigen(N)$values[1];NL2 <- eigen(N)$values[2]
  NV1 <- t(data.frame(eigen(N)$vectors[,1]));if(sum(NV1)<0){NV1 <- -NV1}
  NV2 <- t(data.frame(eigen(N)$vectors[,2]));if(sum(NV2)<0){NV2 <- -NV2}
  colnames(NV1)<-cnames;rownames(NV1) <- year;colnames(NV2)<-cnames;rownames(NV2) <- year
  GL1 <- eigen(G)$values[1];GL2 <- eigen(G)$values[2]
  GV1 <- t(data.frame(eigen(G)$vectors[,1]));if(sum(GV1)<0){GV1 <- -GV1}
  GV2 <- t(data.frame(eigen(G)$vectors[,2]));if(sum(GV2)<0){GV2 <- -GV2}
  colnames(GV1)<-tnames;rownames(GV1) <- year;colnames(GV2)<-tnames;rownames(GV2) <- year
  GPYC <- data.frame((NL1*NV1^2 + NL2*NV2^2)^2 + 2*(NL1^2*NV1^2 + NL2^2*NV2^2));GPYCr <- GPYC
  GPYT <- data.frame((GL1*GV1^2 + GL2*GV2^2)^2 + 2*(GL1^2*GV1^2 + GL2^2*GV2^2));GPYTr <- GPYT
  GPYCr[order(unlist(GPYC),decreasing = TRUE)] <- seq(1,cl,1)
  GPYTr[order(unlist(GPYT),decreasing = TRUE)] <- seq(1,tl,1)
  return(list(GPYC=GPYC,GPYT=GPYT,GPYCr=GPYCr,GPYTr=GPYTr,NV1=NV1,NV2=NV2,GV1=GV1,GV2=GV2))}
#-------------------------------Parameter---------------------------------
Path <- "C:/*******"
filename <- "****.csv"
cl=100 ; tl=35 ; y0=1976 ; y1=1990 ; yt=2019 ; valid = c(1,2,3,4,5,6,8,10,12,15)
#-----------------------------Data Processing-------------------------------
setwd(Path);Data <- data.frame(read.csv(filename))
Data1 <- Data[,c("ISO","WIPO",paste0("X",seq(y1,yt,1)))]
for(y in y1:yt){Data1[,paste0("X",y)]<-rowSums(Data[,paste0("X",seq(y0,y,1))])}
for(v in 1:length(valid)){assign(paste0("Data",v+1),Data1[,1:2]);for(y in y1:yt){
  rs <- data.frame(rowSums(cbind(0,Data[,paste0("X",seq(y-valid[v]+1,y,1)),])))
  colnames(rs) <- paste0("X",y);assign(paste0("Data",v+1),cbind(get(paste0("Data",v+1)),rs))}}
fn<-c("GPYC","GPYT","GPYCr","GPYTr","NV1","NV2","GV1","GV2")
v_len<-length(fn);f_len<-length(valid)+1;fns<-array("",dim=c(f_len,v_len))
for(i in 1:f_len){if(i==1){fns[i,]<-paste0(fn,"_s")}else{fns[i,]<-paste0(fn,"_",valid[i-1],"v")}}
for(i in 1:f_len){for(ii in 1:v_len){assign(fns[i,ii],GPY(y1,get(paste0("Data",i)))[[fn[ii]]])}}
for(i in 1:f_len){for(y in (y1+1):yt){gpy <- GPY(y,get(paste0("Data",i)))
for(ii in 1:v_len){assign(fns[i,ii],rbind(get(fns[i,ii]),gpy[[fn[ii]]]))}}}
#-------------------------------Data Output---------------------------------
for(i in 1:f_len){for(ii in 1:v_len){write.csv(get(fns[i,ii]),file=paste0(fns[i,ii],".csv"))}}