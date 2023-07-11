import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss'],
})
export class DraggableComponent implements OnInit {
  draggable = true;
  @ViewChild('dragable') dragable: ElementRef;
  constructor(private gestureCtrl: GestureController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMoveGesture(this.dragable.nativeElement);
  }

  private initMoveGesture(element: HTMLElement) {
    let initialTransform = '';

    const gesture: Gesture = this.gestureCtrl.create({
      el: element,
      gestureName: 'move',
      onStart: (ev) => {
        // Save the initial transform
        initialTransform = element.style.transform;
      },
      onMove: (ev) => {
        // Update the position of the element to the current coordinates of the pointer
        element.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
        // Check if the draggable element is hovering over the target element
        const draggableRect = element.getBoundingClientRect();
        let targetElements: NodeListOf<HTMLElement> =
          document.querySelectorAll('.target');

        targetElements.forEach((targetElement) => {
          const draggableRect = element.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();

          if (
            draggableRect.x < targetRect.x + targetRect.width &&
            draggableRect.x + draggableRect.width > targetRect.x &&
            draggableRect.y < targetRect.y + targetRect.height &&
            draggableRect.y + draggableRect.height > targetRect.y
          ) {
            targetElement.classList.add('is-hovering');
          } else {
            targetElement.classList.remove('is-hovering');
          }
        });
      },
      onEnd: (ev) => {
        // the gesture ended, move back to original position
        let targetElements: NodeListOf<HTMLElement> =
          document.querySelectorAll('.target');

        targetElements.forEach((targetElement) => {
          const draggableRect = element.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();

          if (
            draggableRect.x < targetRect.x + targetRect.width &&
            draggableRect.x + draggableRect.width > targetRect.x &&
            draggableRect.y < targetRect.y + targetRect.height &&
            draggableRect.y + draggableRect.height > targetRect.y
          ) {
            targetElement.classList.remove('is-hovering');
            // Here, you can perform your specific logic
          }
        });
        element.style.transform = initialTransform;
      },
    });

    // Don't forget to enable the gesture
    gesture.enable();
  }
}
