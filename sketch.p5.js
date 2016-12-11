/**
 * Created by jetbrains on 29/06/16.
 *
 */


import megamu.mesh.*;
import processing.core.PApplet;
import processing.core.PGraphics;
import processing.core.PImage;
import processing.core.PShape;

import java.util.ArrayList;
import java.util.List;


public class Sketch extends PApplet {

    private PImage img, grad;
    PShape my;
    private int lastPoint;

    private int num = 5000;


    private ArrayList<float[]> points = new ArrayList<>();


    private float scale = 1;
    PGraphics pg, l1, l2, l3, regions;


    private int maxSquareSize = 3;

    private int density = 6;
    private float inregularity = 0.7f;



    int step = (int) (12 * scale);





    public void settings() {
        size(1930, 972, JAVA2D);


    }

    public void setup() {


        noLoop();

       // regions = createGraphics(width, height);

    }


    public void draw() {
        background(0x161616);

        img = loadImage("./experiment_bg.png");
        lastPoint = 0;
        img.loadPixels();

        int imgWidth = img.width;
        int imgHeight = img.height;



        for (int x = 0; x < imgWidth; x += step) {

            for (int y = 0; y < imgHeight; y += step) {


                int brightness = (int) brightness(img.get(x, y));


                if (lastPoint < num && brightness > 3 && random(0, brightness) < 70) {

                    float xpos = ((x / (float) imgWidth) * width) + (random(-step / 2, step / 2) * inregularity);
                    float ypos = ((y / (float) imgHeight) * height) + (random(-step / 2, step / 2) * inregularity);

                    points.add(new float[] {xpos, ypos, brightness});

                    lastPoint += 1;


                }
            }
        }


        int i = 0;
        float[][] pointsArray = new float[lastPoint][2];

        while (i < lastPoint) {

            pointsArray[i][0] = points.get(i)[0];
            pointsArray[i][1] = points.get(i)[1];

            i++;

        }





        Delaunay myDelaunay = new Delaunay(pointsArray);
        Voronoi myVoronoi = new Voronoi( pointsArray );

        float[][] myEdges1 = myVoronoi.getEdges();



        beginRecord(PDF, "/Users/jetbrains/Work/generated-art/vectors/back_grid.pdf");

        rectMode(CENTER);

        strokeWeight(0.4f);
        float[][] myEdges = myDelaunay.getEdges();


        for(int n=0; n<myEdges.length; n++)
        {
            float startX = myEdges[n][0];
            float startY = myEdges[n][1];
            float endX = myEdges[n][2];
            float endY = myEdges[n][3];
            stroke(random(70,180));
            if(dist(startX, startY, endX, endY) < 50) {

                line(startX, startY, endX, endY);
            }
            int backgrSquareSize = (int)(random(1,3)*scale);
            fill(random(90,180));
            rect(startX, startY, backgrSquareSize, backgrSquareSize);
        }

        endRecord();

        noStroke();


        beginRecord(PDF, "/Users/jetbrains/Work/generated-art/vectors/patches.pdf");

        MPolygon[] myRegions = myVoronoi.getRegions();



        smooth();




        //blendMode(SCREEN);
        PShape[] shapes = new PShape[myRegions.length];
       // int[] colors = {0xccd5df, 0x8da3b2, 0x6f899f, 0x3b5778, 0xd6dfe6};


        int s = 0;

        for(int j=0; j<myRegions.length; j++) {
            my = createShape();
            float[][] coords= myRegions[j].getCoords();
            my.beginShape();
            my.fill(color(random(255)), random(40, 80));
            my.noStroke();

            List<Float> x = new ArrayList<>();
            List<Float> y = new ArrayList<>();

            for(int l = 0; l < coords.length; ++l) {
                x.add(coords[l][0]);
                y.add(coords[l][1]);

                my.vertex(coords[l][0], coords[l][1]);
            }

            float[] x_array = new float[x.size()];
            for(int m = 0; m < x.size(); m++) x_array[m] = x.get(m);

            float[] y_array = new float[y.size()];
            for(int m = 0; m < x.size(); m++) y_array[m] = y.get(m);




            float width = max(x_array) - min(x_array);
            float height = max(y_array) - min(y_array);
            float area = width * height;




            my.endShape();

            if (area < 2000) {
                shapes[s] = my;
                s++;
            }


            //myRegions[k].draw(this);

        }

        for(int j=0; j<shapes.length; j++ ) {
            if(shapes[j]!=null) shape(shapes[j], 0, 0);
        }



        endRecord();



        beginRecord(PDF, "/Users/jetbrains/Work/generated-art/vectors/voronoi.pdf");



        for (int j = 0; j < myEdges1.length; j++) {


            int brightness = (int) brightness(img.get((int)myEdges1[j][0], (int)myEdges1[j][1]));

            strokeWeight(map(brightness, 0, 255, 0.4f, 0.6f));
            stroke(map(brightness, 0, 255, 100, 255));

           line(myEdges1[j][0], myEdges1[j][1], myEdges1[j][2], myEdges1[j][3]);


        }



        endRecord();



        beginRecord(PDF, "/Users/jetbrains/Work/generated-art/vectors/curved_edges.pdf");



        for (int j = 0; j < myEdges1.length; j++) {


            float startX1 = myEdges1[j][0];
            float startY1 = myEdges1[j][1];


            int randomEdge = (int)random(myEdges1.length);
            float randomX = myEdges1[randomEdge][2];
            float randomY = myEdges1[randomEdge][3];


            if(random(0, 10) < 1 && dist(startX1, startY1, randomX, randomY) < 800 && dist(startX1, startY1, randomX, randomY)> 550) {

                noFill();
                stroke(random(40, 80));
                color(255, 0, 0);
                strokeWeight(random(0.25f, 0.8f));

                bezier(
                        startX1, startY1,
                        startX1, startY1 + 400,
                        randomX, randomY - 400,
                        randomX, randomY
                );


            }

        }
        endRecord();


        beginRecord(PDF, "/Users/jetbrains/Work/generated-art/vectors/squares.pdf");

        rectMode(CENTER);



        for (int j = 0; j < myEdges1.length; j++) {


            int brightness = (int) brightness(img.get((int)myEdges1[j][0], (int)myEdges1[j][1]));
            int squareSize = (int)map(brightness, 0, 255, 2,maxSquareSize);
            noStroke();
            fill(map(brightness, 0, 255, 100, 255));
            rect(myEdges1[j][0], myEdges1[j][1], squareSize , squareSize);


        }


        endRecord();
        //   exit();




    }


}
