package com.ps;

public class Main {

    static void pattern1(int N){
        for(int i= 0; i< N; i++){
            for(int j=0; j<N; j++){
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    static void pattern2(int N){
        for(int i = 0; i< N; i++){
            for(int j=0; j<= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    static void pattern3(int N){
        for(int i =1; i<= N; i++){
            for(int j=1; j<= i; j++){
                System.out.print(j);
            }
            System.out.println();
        }
    }

    static void pattern4(int N){
        for(int i =1; i<= N; i++){
            for(int j=1; j<= i; j++){
                System.out.print(i);
            }
            System.out.println();
        }
    }

    static void pattern5(int N){
        for(int i = 1; i <=N; i++){
            for(int j=0 ; j < N-i+1; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    static void pattern6(int N){
        for(int i = 1; i <=N; i++){
            for(int j=1 ; j <= N-i+1; j++) {
                System.out.print(j);
            }
            System.out.println();
        }
    }

    static void pattern7(int N)
    {
        // This is the outer loop which will loop for the rows.
        for (int i = 0; i < N; i++)
        {
            // For printing the spaces before stars in each row
            for (int j =0; j<N-i-1; j++)
            {
                System.out.print(" ");
            }

            // For printing the stars in each row
            for(int j=0;j< 2*i+1;j++){

                System.out.print("*");
            }

            // For printing the spaces after the stars in each row
            for (int j =0; j<N-i-1; j++)
            {
                System.out.print(" ");
            }


            // As soon as the stars for each iteration are printed, we move to the
            // next row and give a line break otherwise all stars
            // would get printed in 1 line.
            System.out.println();
        }
    }

    static void pattern8(int N)
    {
        // This is the outer loop which will loop for the rows.
        for (int i = 0; i < N; i++)
        {
            // For printing the spaces before stars in each row
            for (int j =0; j<i; j++)
            {
                System.out.print(" ");
            }

            // For printing the stars in each row
            for(int j=0;j< 2*N -(2*i +1);j++){

                System.out.print("*");
            }

            // For printing the spaces after the stars in each row
            for (int j =0; j<i; j++)
            {
                System.out.print(" ");
            }


            // As soon as the stars for each iteration are printed, we move to the
            // next row and give a line break otherwise all stars
            // would get printed in 1 line.
            System.out.println();
        }
    }

    static void pattern9(int N){
        for(int i = 1; i<=2*N-1; i++){
            int stars = i;
            if(i >N) stars = 2*N-i;
            for(int j =1; j<= stars; j++){
                System.out.print("*");
            }
            System.out.println();
        }

    }

    static void pattern10(int N){
        int start =1;
        for(int i = 0; i<N; i++){

            if(i %2 ==0) start = 1;
            else start =0;
            for(int j =0; j<=i; j++){
                System.out.print(start);
                start =1-start;
            }
            System.out.println();
        }

    }



    public static void main(String[] args) {
        int N = 5;
       pattern10(N);
    }
}